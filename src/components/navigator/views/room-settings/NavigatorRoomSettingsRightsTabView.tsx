import { RoomGiveRightsComposer, FlatControllerAddedEvent, FlatControllerRemovedEvent, FlatControllersEvent, RemoveAllRightsMessageComposer, RoomTakeRightsComposer, RoomUsersWithRightsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState, useMemo } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
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
            <Flex justifyContent="between" alignItems="center">
                <Text small bold>{ LocalizeText('navigator.flatctrls.filter') }</Text>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Flex>
            <Flex gap={ 3 }>
                <Column className="w-100">
                    <Text small>
                        { LocalizeText('navigator.flatctrls.userswithrights', [ 'displayed', 'total' ], [ usersWithRights.size.toString(), usersWithRights.size.toString() ]) }
                    </Text>
                    <Column overflow="hidden" className="bg-white margin-top-auto list-container p-1">
                        <Column fullWidth overflow="auto" gap={ 0 }>
                            { filteredUsersWithRights.map(([ id, name ], index) =>
                            {
                                return (
                                    <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                        <UserProfileIconView userName={ name } />
                                        <Text pointer grow onClick={ event => SendMessageComposer(new RoomTakeRightsComposer(id)) }> { name }</Text>
                                    </Flex>
                                );
                            }) }
                        </Column>
                        <Button className="margin-top-auto rights-button" variant="thicker" disabled={ !usersWithRights.size } onClick={ event => SendMessageComposer(new RemoveAllRightsMessageComposer(roomData.roomId)) } >
                            { LocalizeText('navigator.flatctrls.clear') }
                        </Button>
                    </Column>
                </Column>
                <Column className="w-100" justifyContent="end">
                    <Text small>
                        { LocalizeText('navigator.flatctrls.friends', [ 'displayed', 'total' ], [ filteredFriendsWithoutRights.length.toString(), friends.length.toString() ]) }
                    </Text>
                    <Flex overflow="hidden" className="bg-white margin-top-auto list-container p-1">
                        <Column fullWidth overflow="auto" gap={0}>
                            {filteredFriendsWithoutRights.map((friend, index) => {
                                return (
                                    <Flex key={index} shrink alignItems="center" gap={1} overflow="hidden">
                                        <UserProfileIconView userName={friend.name} />
                                        <Text pointer grow onClick={() => giveRightsToFriend(friend.id)}>
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
