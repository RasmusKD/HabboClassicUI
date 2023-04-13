import { BannedUserData, BannedUsersFromRoomEvent, RoomBannedUsersComposer, RoomModerationSettings, RoomUnbanUserComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsModTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ selectedUserId, setSelectedUserId ] = useState<number>(-1);
    const [ bannedUsers, setBannedUsers ] = useState<BannedUserData[]>([]);
    const [isMuteOpen, setIsMuteOpen] = useState(false);
    const [isKickOpen, setIsKickOpen] = useState(false);
    const [isBanOpen, setIsBanOpen] = useState(false);

    const handleSelectToggle = (selectName) => {
        switch (selectName) {
            case 'Mute':
                setIsMuteOpen(!isMuteOpen);
                break;
            case 'Kick':
                setIsKickOpen(!isKickOpen);
                break;
            case 'Ban':
                setIsBanOpen(!isBanOpen);
                break;
            default:
                break;
        }
    };
    const unBanUser = (userId: number) =>
    {
        setBannedUsers(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const index = newValue.findIndex(value => (value.userId === userId));

            if(index >= 0) newValue.splice(index, 1);

            return newValue;
        })

        SendMessageComposer(new RoomUnbanUserComposer(userId, roomData.roomId));

        setSelectedUserId(-1);
    }

    useMessageEvent<BannedUsersFromRoomEvent>(BannedUsersFromRoomEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setBannedUsers(parser.bannedUsers);
    });

    useEffect(() =>
    {
        SendMessageComposer(new RoomBannedUsersComposer(roomData.roomId));
    }, [ roomData.roomId ]);

    return (
        <Column>
            <Column className="friendbars something3" gap={ 1 }>
                <Text small bold>{ LocalizeText('navigator.roomsettings.moderation.mute.header') }</Text>
                <select className={`form-select form-select-sm ${isMuteOpen ? 'active' : ''}`} value={ roomData.moderationSettings.allowMute } onChange={ event => handleChange('moderation_mute', parseInt(event.target.value)) } onClick={() => handleSelectToggle('Mute')} onBlur={() => setIsMuteOpen(false)}>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>{ LocalizeText('navigator.roomsettings.moderation.none') }</option>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>{ LocalizeText('navigator.roomsettings.moderation.rights') }</option>
                </select>
                <Text small bold>{ LocalizeText('navigator.roomsettings.moderation.kick.header') }</Text>
                <select className={`form-select form-select-sm ${isKickOpen ? 'active' : ''}`} value={ roomData.moderationSettings.allowKick } onChange={ event => handleChange('moderation_kick', parseInt(event.target.value)) } onClick={() => handleSelectToggle('Kick')} onBlur={() => setIsKickOpen(false)}>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>{ LocalizeText('navigator.roomsettings.moderation.none') }</option>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>{ LocalizeText('navigator.roomsettings.moderation.rights') }</option>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_ALL }>{ LocalizeText('navigator.roomsettings.moderation.all') }</option>
                </select>
                <Text small bold>{ LocalizeText('navigator.roomsettings.moderation.ban.header') }</Text>
                <select className={`form-select form-select-sm ${isBanOpen ? 'active' : ''}`} value={ roomData.moderationSettings.allowBan } onChange={ event => handleChange('moderation_ban', parseInt(event.target.value)) } onClick={() => handleSelectToggle('Ban')} onBlur={() => setIsBanOpen(false)}>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>{ LocalizeText('navigator.roomsettings.moderation.none') }</option>
                    <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>{ LocalizeText('navigator.roomsettings.moderation.rights') }</option>
                </select>
            </Column>
            <Column>
                <Flex gap={ 2 } alignItems="center">
                    <Column overflow="hidden" className="rights-container p-1 w-100">
                        <Column fullWidth overflow="auto" gap={ 1 }>
                            { bannedUsers && (bannedUsers.length > 0) && bannedUsers.map((user, index) =>
                            {
                                return (
                                    <Flex key={ index } shrink className="banItem" alignItems="center" gap={ 1 } overflow="hidden">
                                        <UserProfileIconView userName={ user.userId } />
                                        <Text small pointer grow onClick={ event => setSelectedUserId(user.userId) }> { user.userName }</Text>
                                    </Flex>
                                );
                            }) }
                        </Column>
                    </Column>
                    <Column className="w-100">
                        <Text small>{ LocalizeText('navigator.roomsettings.moderation.banned.users') } ({ bannedUsers.length })</Text>
                        <Button disabled={ (selectedUserId <= 0) } onClick={ event => unBanUser(selectedUserId) } className="unban-button">
                            { LocalizeText('navigator.roomsettings.moderation.unban') } { selectedUserId > 0 && bannedUsers.find(user => (user.userId === selectedUserId))?.userName }
                        </Button>
                    </Column>
                </Flex>
            </Column>
        </Column>
    );
}
