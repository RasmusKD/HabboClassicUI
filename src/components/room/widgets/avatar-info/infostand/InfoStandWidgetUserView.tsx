import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionFavoriteGroupUpdateEvent, RoomSessionUserBadgesEvent, RoomSessionUserFigureUpdateEvent, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, FocusEvent, KeyboardEvent, SetStateAction, useEffect, useState } from 'react';
import { AvatarInfoUser, CloneObject, GetConfiguration, GetGroupInformation, GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text, useFilteredInput } from '../../../../../common';
import { useMessageEvent, useNitroEvent, useRoom } from '../../../../../hooks';
import { InfoStandWidgetUserRelationshipsView } from './InfoStandWidgetUserRelationshipsView';
import { InfoStandWidgetUserTagsView } from './InfoStandWidgetUserTagsView';
import { BackgroundsView } from '../../../../backgrounds/BackgroundsView';

interface InfoStandWidgetUserViewProps
{
    avatarInfo: AvatarInfoUser;
    setAvatarInfo: Dispatch<SetStateAction<AvatarInfoUser>>;
    onClose: () => void;
}

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { avatarInfo = null, setAvatarInfo = null, onClose = null } = props;
    const [ motto, setMotto ] = useState<string>(null);
    const [ isEditingMotto, setIsEditingMotto ] = useState(false);
    const [ relationships, setRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);
    const { roomSession = null } = useRoom();
    const [ backgroundId, setBackgroundId ] = useState<number>(null);
    const [ standId, setStandId ] = useState<number>(null);
    const [ overlayId, setOverlayId ] = useState<number>(null);
    const [ rankId, setRankId ] = useState<number>(null);
    const [ isVisible, setIsVisible ] = useState(false);

    const infostandBackgroundClass = `background-${ backgroundId }`;
    const infostandStandClass = `stand-${ standId }`;
    const infostandOverlayClass = `overlay-${ overlayId }`;

    const handleInputChange = useFilteredInput(motto, setMotto);

    const saveMotto = (motto: string) =>
    {
        if(!isEditingMotto || (motto.length > GetConfiguration<number>('motto.max.length', 38))) return;

        roomSession.sendMottoMessage(motto);

        setIsEditingMotto(false);
    }

    const onMottoBlur = (event: FocusEvent<HTMLInputElement>) => saveMotto(event.target.value);

    const onMottoKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        event.stopPropagation();

        switch(event.key)
        {
            case 'Enter':
                saveMotto((event.target as HTMLInputElement).value);
                return;
        }
    }

    useNitroEvent<RoomSessionUserBadgesEvent>(RoomSessionUserBadgesEvent.RSUBE_BADGES, event =>
    {
        if(!avatarInfo || (avatarInfo.webID !== event.userId)) return;

        const oldBadges = avatarInfo.badges.join('');

        if(oldBadges === event.badges.join('')) return;

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.badges = event.badges;

            return newValue;
        });
    });

    useNitroEvent<RoomSessionUserFigureUpdateEvent>(RoomSessionUserFigureUpdateEvent.USER_FIGURE, event =>
    {
        if(!avatarInfo || (avatarInfo.roomIndex !== event.roomIndex)) return;

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.figure = event.figure;
            newValue.motto = event.customInfo;
            newValue.rankId = event.rankId;
            newValue.backgroundId = event.backgroundId;
            newValue.standId = event.standId;
            newValue.overlayId = event.overlayId;
            newValue.achievementScore = event.activityPoints;

            return newValue;
        });
    });

    useNitroEvent<RoomSessionFavoriteGroupUpdateEvent>(RoomSessionFavoriteGroupUpdateEvent.FAVOURITE_GROUP_UPDATE, event =>
    {
        if(!avatarInfo || (avatarInfo.roomIndex !== event.roomIndex)) return;

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue);
            const clearGroup = ((event.status === -1) || (event.habboGroupId <= 0));

            newValue.groupId = clearGroup ? -1 : event.habboGroupId;
            newValue.groupName = clearGroup ? null : event.habboGroupName
            newValue.groupBadgeId = clearGroup ? null : GetSessionDataManager().getGroupBadge(event.habboGroupId);

            return newValue;
        });
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!avatarInfo || (avatarInfo.webID !== parser.userId)) return;

        setRelationships(parser);
    });

    useEffect(() =>
    {
        setIsEditingMotto(false);
        setMotto(avatarInfo.motto);
        setRankId(avatarInfo.rankId);
        setBackgroundId(avatarInfo.backgroundId);
        setStandId(avatarInfo.standId);
        setOverlayId(avatarInfo.overlayId);


        SendMessageComposer(new UserRelationshipsComposer(avatarInfo.webID));

        return () =>
        {
            setIsEditingMotto(false);
            setMotto(null);
            setRelationships(null);
            setRankId(null);
            setBackgroundId(null);
            setStandId(null);
            setOverlayId(null);

        }
    }, [ avatarInfo ]);

    if(!avatarInfo) return null;

    return (
        <Column className="nitro-infostand rounded">
            <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                <Column gap={ 1 }>
                    <Flex alignItems="center" justifyContent="between">
                        <Flex alignItems="center" gap={ 1 }>
                            <i className="icon icon-profile-person cursor-pointer" onClick={ event => GetUserProfile(avatarInfo.webID) }/>
                            <Text gfbold variant="white" className="infostand-name" onClick={ event => GetUserProfile(avatarInfo.webID) }>{ avatarInfo.name }</Text>
                        </Flex>
                        <i className="infostand-close" onClick={ onClose } />
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex gap={ 1 }>
                        <Column position="relative" pointer fullWidth className={ `body-image profile-background ${ infostandBackgroundClass }` } onClick={ event => GetUserProfile(avatarInfo.webID) }>
                            <Base position="absolute" className={ `body-image profile-stand ${ infostandStandClass }` }/>
                            <LayoutAvatarImageView figure={ avatarInfo.figure } direction={ 4 } />
                            <Base position="absolute" className={ `body-image profile-overlay ${ infostandOverlayClass }` }/>
                            { avatarInfo.type === AvatarInfoUser.OWN_USER &&
                                <Base className="icon edit-icon edit-position" onClick={ event =>
                                {
                                    event.stopPropagation(); setIsVisible(prevValue => !prevValue);
                                } } />
                            }
                        </Column>
                        <Column grow alignItems="center" gap={ 0 }>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { avatarInfo.badges[0] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[0] } showInfo={ true } /> }
                                </Base>
                                <Base pointer={ ( avatarInfo.groupId > 0) } className="badge-image" onClick={ event => GetGroupInformation(avatarInfo.groupId) }>
                                    { avatarInfo.groupId > 0 &&
                                        <LayoutBadgeImageView badgeCode={ avatarInfo.groupBadgeId } isGroup={ true } showInfo={ true } customTitle={ avatarInfo.groupName } /> }
                                </Base>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { avatarInfo.badges[1] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[1] } showInfo={ true } /> }
                                </Base>
                                <Base className="badge-image">
                                    { avatarInfo.badges[2] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[2] } showInfo={ true } /> }
                                </Base>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { avatarInfo.badges[3] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[3] } showInfo={ true } /> }
                                </Base>
                                <Base className="badge-image">
                                    { avatarInfo.badges[4] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[4] } showInfo={ true } /> }
                                </Base>
                            </Flex>
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex alignItems="center" className="infostand-thumb-bg py-1 px-2">
                        { rankId != null &&
                        <Text fullWidth pointer wrap textBreak variant="white">{ rankId }</Text> }
                        { (avatarInfo.type !== AvatarInfoUser.OWN_USER) &&
                            <Flex grow alignItems="center" className="motto-content">
                                <Text fullWidth pointer wrap textBreak variant="white">{ motto }</Text>
                            </Flex> }
                        { avatarInfo.type === AvatarInfoUser.OWN_USER &&
                            <Flex grow alignItems="center" gap={ 2 }>
                                <i className="icon pencil3-icon" />
                                <Flex grow alignItems="center" className="own-motto-content">
                                    { !isEditingMotto &&
                                        <Text fullWidth pointer wrap textBreak variant="white" onClick={ event => setIsEditingMotto(true) }>{ motto }&nbsp;</Text> }
                                    { isEditingMotto &&
                                        <input spellCheck="false" type="text" className="motto-input" maxLength={ GetConfiguration<number>('motto.max.length', 38) } value={ motto } onChange={ handleInputChange } onBlur={ onMottoBlur } onKeyDown={ onMottoKeyDown } autoFocus={ true } /> }
                                </Flex>
                            </Flex> }
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    { (avatarInfo.carryItem > 0) &&
                        <>
                            <Text gfbold variant="white" wrap>
                                { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
                            </Text>
                        </> }
                    <InfoStandWidgetUserRelationshipsView relationships={ relationships } />
                </Column>
                { GetConfiguration('user.tags.enabled') &&
                    <Column gap={ 1 } className="mt-1">
                        <InfoStandWidgetUserTagsView tags={ GetSessionDataManager().tags } />
                    </Column>
                }
            </Column>
            { (isVisible && avatarInfo.type === AvatarInfoUser.OWN_USER) &&
                <BackgroundsView
                    setIsVisible={ setIsVisible }
                    selectedBackground={ backgroundId }
                    setSelectedBackground={ setBackgroundId }
                    selectedStand={ standId }
                    setSelectedStand={ setStandId }
                    selectedOverlay={ overlayId }
                    setSelectedOverlay={ setOverlayId }
                />
            }
        </Column>
    );
}
