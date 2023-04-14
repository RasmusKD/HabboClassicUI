import { RoomGiveRightsComposer, FlatControllerAddedEvent, FlatControllerRemovedEvent, FlatControllersEvent, RemoveAllRightsMessageComposer, RoomTakeRightsComposer, RoomUsersWithRightsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState, useMemo } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
import { useFriends, useMessageEvent } from '../../../../hooks';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null } = props;
    const [ usersWithRights, setUsersWithRights ] = useState<Map<number, string>>(new Map());
    const { friends } = useFriends();
    const [searchTerm, setSearchTerm] = useState(''); // Create state for the search term

    const friendsWithoutRights = useMemo(() => {
        return friends.filter(friend => !usersWithRights.has(friend.id));
    }, [friends, usersWithRights]);

    const filteredUsersWithRights = useMemo(() => {
        return Array.from(usersWithRights.entries())
            .filter(([id, name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort(([idA, nameA], [idB, nameB]) => nameA.toLowerCase().localeCompare(nameB.toLowerCase()));
    }, [usersWithRights, searchTerm]);

    const filteredFriendsWithoutRights = useMemo(() => {
        return friendsWithoutRights
            .filter(friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((friendA, friendB) => friendA.name.toLowerCase().localeCompare(friendB.name.toLowerCase()));
    }, [friendsWithoutRights, searchTerm]);

    const giveRightsToFriend = (friendId: number) => {
        SendMessageComposer(new RoomGiveRightsComposer(friendId));
    };

    useMessageEvent<FlatControllersEvent>(FlatControllersEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setUsersWithRights(parser.users);
    });

    useMessageEvent<FlatControllerAddedEvent>(FlatControllerAddedEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setUsersWithRights(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.set(parser.data.userId, parser.data.userName);

            return newValue;
        });
    });

    useMessageEvent<FlatControllerRemovedEvent>(FlatControllerRemovedEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setUsersWithRights(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.delete(parser.userId);

            return newValue;
        });
    });

    useEffect(() =>
    {
        SendMessageComposer(new RoomUsersWithRightsComposer(roomData.roomId));
    }, [ roomData.roomId ]);

    return (
        <Column>
            <Flex justifyContent="between" alignItems="center" className="filter-container">
                <Text small bold>{ LocalizeText('navigator.flatctrls.filter') }</Text>
                <input spellCheck="false" className="form-control form-control6 filter-width" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Flex>
            <Flex className="friendbars something3" gap={ 3 }>
                <Column gap={ 1 } className="w-100">
                    <Text className="small-lineheight">
                        { LocalizeText('navigator.flatctrls.userswithrights', [ 'displayed', 'total' ], [ filteredUsersWithRights.length.toString(), usersWithRights.size.toString() ]) }
                    </Text>
                    <Column gap={ 1 } overflow="hidden" className="margin-top-auto settings-user-container rights-height p-1">
                        <Column fullWidth overflow="auto" gap={ 0 }>
                            { filteredUsersWithRights.map(([ id, name ], index) =>
                            {
                                return (
                                    <Flex key={ index } shrink className="nameItem" alignItems="center" gap={ 1 } overflow="hidden">
                                        <UserProfileIconView userId={id} />
                                        <Text small pointer grow onClick={ event => SendMessageComposer(new RoomTakeRightsComposer(id)) }> { name }</Text>
                                        <Base className="arrowRight"/>
                                    </Flex>
                                );
                            }) }
                        </Column>
                        <Button className="margin-top-auto rights-button" variant="thicker" disabled={ !usersWithRights.size } onClick={ event => SendMessageComposer(new RemoveAllRightsMessageComposer(roomData.roomId)) } >
                            { LocalizeText('navigator.flatctrls.clear') }
                        </Button>
                    </Column>
                </Column>
                <Column gap={ 1 } className="w-100" justifyContent="end">
                    <Text className="small-lineheight">
                        { LocalizeText('navigator.flatctrls.friends', [ 'displayed', 'total' ], [ filteredFriendsWithoutRights.length.toString(), friends.length.toString() ]) }
                    </Text>
                    <Flex overflow="hidden" className="margin-top-auto settings-user-container rights-height p-1">
                        <Column fullWidth overflow="auto" gap={0}>
                            {filteredFriendsWithoutRights.map((friend, index) => {
                                return (
                                    <Flex key={index} shrink className="nameItem" alignItems="center" gap={1} overflow="hidden">
                                        <Base className="arrowLeft"/>
                                        <UserProfileIconView userId={friend.id} />
                                        <Text small pointer grow onClick={() => giveRightsToFriend(friend.id)}>
                                            {friend.name}
                                        </Text>
                                    </Flex>
                                );
                            })}
                        </Column>
                    </Flex>
                </Column>
            </Flex>
        </Column>
    );
};
