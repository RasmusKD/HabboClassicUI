import { GetCustomRoomFilterMessageComposer, NavigatorSearchComposer, RoomMuteComposer, RoomSettingsComposer, SecurityLevel, ToggleStaffPickMessageComposer, UpdateHomeRoomMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, DispatchUiEvent, GetGroupInformation, GetSessionDataManager, GetUserProfile, LocalizeText, ReportType, SendMessageComposer } from '../../../api';
import { Base, Button, classNames, Column, Flex, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text, Tooltip, UserProfileIconView } from '../../../common';
import { RoomWidgetThumbnailEvent } from '../../../events';
import { useHelp, useNavigator } from '../../../hooks';

export class NavigatorRoomInfoViewProps
{
    onCloseClick: () => void;
}

export const NavigatorRoomInfoView: FC<NavigatorRoomInfoViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const [ isRoomPicked, setIsRoomPicked ] = useState(false);
    const [ isRoomMuted, setIsRoomMuted ] = useState(false);
    const { report = null } = useHelp();
    const { navigatorData = null } = useNavigator();

    const hasPermission = (permission: string) =>
    {
        switch(permission)
        {
            case 'settings':
                return (GetSessionDataManager().userId === navigatorData.enteredGuestRoom.ownerId || GetSessionDataManager().isModerator);
            case 'staff_pick':
                return GetSessionDataManager().securityLevel >= SecurityLevel.COMMUNITY;
            default: return false;
        }
    }

    const processAction = (action: string, value?: string) =>
    {
        if(!navigatorData || !navigatorData.enteredGuestRoom) return;

        switch(action)
        {
            case 'set_home_room':
                let newRoomId = -1;

                if(navigatorData.homeRoomId !== navigatorData.enteredGuestRoom.roomId)
                {
                    newRoomId = navigatorData.enteredGuestRoom.roomId;
                }

                if(newRoomId > 0) SendMessageComposer(new UpdateHomeRoomMessageComposer(newRoomId));
                return;
            case 'navigator_search_tag':
                CreateLinkEvent(`navigator/search/${ value }`);
                SendMessageComposer(new NavigatorSearchComposer('hotel_view', `tag:${ value }`));
                return;
            case 'open_room_thumbnail_camera':
                DispatchUiEvent(new RoomWidgetThumbnailEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL));
                return;
            case 'open_group_info':
                GetGroupInformation(navigatorData.enteredGuestRoom.habboGroupId);
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
            case 'open_room_settings':
                SendMessageComposer(new RoomSettingsComposer(navigatorData.enteredGuestRoom.roomId));
                return;
            case 'toggle_pick':
                setIsRoomPicked(value => !value);
                SendMessageComposer(new ToggleStaffPickMessageComposer(navigatorData.enteredGuestRoom.roomId));
                return;
            case 'toggle_mute':
                setIsRoomMuted(value => !value);
                SendMessageComposer(new RoomMuteComposer());
                return;
            case 'room_filter':
                SendMessageComposer(new GetCustomRoomFilterMessageComposer(navigatorData.enteredGuestRoom.roomId));
                return;
            case 'open_floorplan_editor':
                CreateLinkEvent('floor-editor/toggle');
                return;
            case 'report_room':
                report(ReportType.ROOM, { roomId: navigatorData.enteredGuestRoom.roomId, roomName: navigatorData.enteredGuestRoom.roomName });
                return;
            case 'close':
                onCloseClick();
                return;
        }

    }

    useEffect(() =>
    {
        if(!navigatorData) return;

        setIsRoomPicked(navigatorData.currentRoomIsStaffPick);

        if(navigatorData.enteredGuestRoom) setIsRoomMuted(navigatorData.enteredGuestRoom.allInRoomMuted);
    }, [ navigatorData ]);

    if(!navigatorData.enteredGuestRoom) return null;

    return (
        <NitroCardView id='RoomSettings' overflow="visible" className="nitro-room-info no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings.roominfo') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView className="text-black">
                { navigatorData.enteredGuestRoom &&
                    <>
                        <Flex gap={ 2 } overflow="hidden">
                            <Column grow gap={ 1 } overflow="hidden">
                                <Flex gap={ 1 }>
                                    <Column className='overflow-hidden' grow gap={ 1 }>
                                        <Flex gap={ 1 }>
                                            <Text small bold>{ navigatorData.enteredGuestRoom.roomName }</Text>
                                        </Flex>
                                        { navigatorData.enteredGuestRoom.showOwner &&
                                            <Tooltip windowId="RoomSettings" isDraggable={true} content={ LocalizeText('infostand.profile.link.tooltip') }>
                                            <Flex pointer alignItems="center" gap={ 1 } onClick={ event => GetUserProfile(navigatorData.enteredGuestRoom.ownerId ) } >
                                                <Text className='room-settings-font'>{ LocalizeText('navigator.roomownercaption') }</Text>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    <UserProfileIconView userId={ navigatorData.enteredGuestRoom.ownerId } />
                                                    <Text small>{ navigatorData.enteredGuestRoom.ownerName }</Text>
                                                </Flex>
                                            </Flex></Tooltip> }
                                        <Flex alignItems="center" gap={ 1 }>
                                            <Text className='room-settings-font'>{ LocalizeText('navigator.roomrating') }</Text>
                                            <Text small>{ navigatorData.currentRoomRating }</Text>
                                        </Flex>
                                        { (navigatorData.enteredGuestRoom.tags.length > 0) &&
                                            <Flex className='tag-wrap' alignItems="center">
                                                { navigatorData.enteredGuestRoom.tags.map(tag =>
                                                {
                                                    return <Text key={ tag } pointer className="tag-bg" onClick={ event => processAction('navigator_search_tag', tag) }>#{ tag }</Text>
                                                }) }
                                            </Flex> }
                                    </Column>
                                    <Column alignItems="center" gap={ 1 }>
                                        {(navigatorData.homeRoomId !== navigatorData.enteredGuestRoom.roomId) &&
                                        <Tooltip windowId="RoomSettings" isDraggable={true} content={ LocalizeText('navigator.roominfo.makehome.tooltip') }><i onClick={ () => processAction('set_home_room') } className={ classNames('flex-shrink-0 icon icon-house-small cursor-pointer', ((navigatorData.homeRoomId !== navigatorData.enteredGuestRoom.roomId) && 'gray')) } /></Tooltip>}
                                        {(navigatorData.homeRoomId === navigatorData.enteredGuestRoom.roomId) &&
                                        <i onClick={ () => processAction('set_home_room') } className={ classNames('flex-shrink-0 icon icon-house-small') } />}
                                    </Column>
                                </Flex>
                                <Text small overflow="hidden" style={ { maxHeight: 70 } }>{ navigatorData.enteredGuestRoom.description }</Text>
                                <Flex justifyContent="center">
                                    <LayoutRoomThumbnailView roomId={ navigatorData.enteredGuestRoom.roomId } customUrl={ navigatorData.enteredGuestRoom.officialRoomPicRef }>
                                        { hasPermission('settings') && <Tooltip windowId="RoomSettings" isDraggable={true} content={ LocalizeText('tooltip.navigator.room.info.add.thumbnail') }><i className="icon icon-camera-small position-absolute b-0 r-0 m-1 cursor-pointer bottom-0 end-0" onClick={ () => processAction('open_room_thumbnail_camera') } /></Tooltip> }
                                    </LayoutRoomThumbnailView>
                                </Flex>
                                { (navigatorData.enteredGuestRoom.habboGroupId > 0) &&
                                    <Flex pointer alignItems="center" gap={ 2 } onClick={ () => processAction('open_group_info') }>
                                        <LayoutBadgeImageView className="flex-none" badgeCode={ navigatorData.enteredGuestRoom.groupBadgeCode } isGroup={ true } />
                                        <Text small underline>
                                            { LocalizeText('navigator.guildbase', [ 'groupName' ], [ navigatorData.enteredGuestRoom.groupName ]) }
                                        </Text>
                                    </Flex>
                                }
                                <Flex gap={ 1 } className="w-100 room-tool-item" onClick={ () => processAction('toggle_room_link') }>
                                    <Base pointer className="icon-width icon icon-link-room float-start" />
                                    <Text underline small >{ LocalizeText('navigator.embed.caption') }</Text>
                                </Flex>
                            </Column>
                        </Flex>
                        <Column className='button-gap'>
                            { hasPermission('staff_pick') &&
                            <Button onClick={ () => processAction('toggle_pick') }>
                                { LocalizeText(isRoomPicked ? 'navigator.staffpicks.unpick' : 'navigator.staffpicks.pick') }
                            </Button> }
                            { !hasPermission('settings') &&
                            <Button variant="danger" onClick={ () => processAction('report_room') }>
                                { LocalizeText('help.emergency.main.report.room') }
                            </Button> }
                            { hasPermission('settings') &&
                            <>
                                <Button onClick={ () => processAction('open_room_settings') }>
                                    { LocalizeText('navigator.room.popup.info.room.settings') }
                                </Button>
                                <Button onClick={ () => processAction('room_filter') }>
                                    { LocalizeText('navigator.roomsettings.roomfilter') }
                                </Button>
                                <Button onClick={ () => processAction('open_floorplan_editor') }>
                                    { LocalizeText('open.floor.plan.editor') }
                                </Button>
                                <Button variant='illumina button-seperator' className='report-button' onClick={ () => processAction('report_room') }>
                                    <Base className='report-image'/>
                                    <Base className='report-text'>{ LocalizeText('help.emergency.main.report.room') }</Base>
                                </Button>
                                <Button onClick={ () => processAction('toggle_mute') }>
                                    { LocalizeText(isRoomMuted ? 'navigator.muteall_on' : 'navigator.muteall_off') }
                                </Button>
                            </> }
                        </Column>
                    </> }

            </NitroCardContentView>
        </NitroCardView>
    );
};
