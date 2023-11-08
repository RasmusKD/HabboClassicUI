import { ExtendedProfileChangedMessageEvent, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, FriendsStatusInfoEvent, FriendsStatusInfoMessageParser, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectType, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer, UserFriendsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { CreateLinkEvent, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useMessageEvent, useNitroEvent } from '../../hooks';
import { BadgesContainerView } from './views/BadgesContainerView';
import { FriendsContainerView } from './views/FriendsContainerView';
import { GroupsContainerView } from './views/GroupsContainerView';
import { UserContainerView } from './views/UserContainerView';
import { RelationshipsContainerView } from './views/RelationshipsContainerView';
import { AllFriendsContainerView } from './views/AllFriendsContainerView';
export const UserProfileView: FC<{}> = props =>
{
    const [ userProfile, setUserProfile ] = useState<UserProfileParser>(null);
    const [ userBadges, setUserBadges ] = useState<string[]>([]);
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);
    const [ userFriends, setUserFriends ] = useState<FriendsStatusInfoMessageParser>(null);
    const [ isVisible, setVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();
    const [ friendsVisible, setFriendsVisible ] = useState(false);

    const onClose = () =>
    {
        setUserProfile(null);
        setUserBadges([]);
        setUserRelationships(null);
        setUserFriends(null);
        setFriendsVisible(false);
    }

    const onLeaveGroup = () =>
    {
        if(!userProfile || (userProfile.id !== GetSessionDataManager().userId)) return;

        GetUserProfile(userProfile.id);
    }

    const handleAction = (action: string) => 
    {
        switch(action) 
        {
            case 'relationships':
                setFriendsVisible(prev => !prev);
                break;
        }
    }

    const closeFriendsView = () => 
    {
        setFriendsVisible(false);
    }

    useMessageEvent<UserCurrentBadgesEvent>(UserCurrentBadgesEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserBadges(parser.badges);
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserRelationships(parser);
    });

    useMessageEvent<FriendsStatusInfoEvent>(FriendsStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserFriends(parser);
    });

    useMessageEvent<UserProfileEvent>(UserProfileEvent, event =>
    {
        const parser = event.getParser();

        let isSameProfile = false;

        setUserProfile(prevValue =>
        {
            if(prevValue && prevValue.id) isSameProfile = (prevValue.id === parser.id);

            return parser;
        });

        if(!isSameProfile)
        {
            setUserBadges([]);
            setUserRelationships(null);
            setUserFriends(null);
        }

        SendMessageComposer(new UserCurrentBadgesComposer(parser.id));
        SendMessageComposer(new UserRelationshipsComposer(parser.id));
        SendMessageComposer(new UserFriendsComposer(parser.id));
    });

    useMessageEvent<ExtendedProfileChangedMessageEvent>(ExtendedProfileChangedMessageEvent, event =>
    {
        const parser = event.getParser();

        if(parser.userId != userProfile?.id) return;

        GetUserProfile(parser.userId);
    });

    useNitroEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event =>
    {
        if(!userProfile) return;

        if(event.category !== RoomObjectCategory.UNIT) return;

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId);

        if(userData.type !== RoomObjectType.USER) return;

        GetUserProfile(userData.webID);
    });

    if(!userProfile) return null;

    return (
        <NitroCardView id="UserProfile" overflow="visible" uniqueKey="nitro-user-profile" theme="primary" className="user-profile">
            <NitroCardHeaderView headerText={ LocalizeText('extendedprofile.caption') } onCloseClick={ onClose } />
            <NitroCardContentView className="user-profile" overflow="hidden">
                <Grid fullHeight={ false } gap={ 2 }>
                    <Column size={ 7 } gap={ 1 } className="user-container pe-2">
                        <UserContainerView userProfile={ userProfile } />
                        { userProfile.id === GetSessionDataManager().userId &&
                          <Flex className="p-0 margin-top-auto">
                              <Text underline className="cursor-pointer font-size-11" onClick={ event => CreateLinkEvent('avatar-editor/toggle') }>
                                  { LocalizeText('habboclassic.dk.clothes') }
                              </Text>
                              <Text className="cursor-pointer badge-text font-size-11" underline onClick={ event => CreateLinkEvent('inventory/toggle') }>
                                  { LocalizeText('habboclassic.dk.badges') }
                              </Text>
                          </Flex>
                        }
                        <Grid columnCount={ 5 } fullHeight className={ `profile-grey-bg p-1 ${ userProfile.id !== GetSessionDataManager().userId && 'margin-top-auto' }` }>
                            <BadgesContainerView fullWidth center badges={ userBadges } />
                        </Grid>
                    </Column>
                    <Column size={ 5 }>
                        { userRelationships &&
                            <Column gap={ 1 }>
                                <Flex justifyContent="between">
                                    <Text className="font-size-11">
                                        <b>{ LocalizeText('extendedprofile.friends.count') }</b> { userProfile.friendsCount }
                                    </Text>
                                    <Text className="font-size-11" underline pointer onClick={ () => handleAction('relationships') }>
                                        <b>Vis alle venner</b>
                                    </Text>
                                </Flex>
                                <Text bold small>{ LocalizeText('extendedprofile.relstatus') }</Text>
                                <Column>
                                    <RelationshipsContainerView relationships={ userRelationships } />
                                </Column>
                            </Column> }
                        { friendsVisible &&
                            <AllFriendsContainerView friends={ userFriends } username={ userProfile.username } onClose={ closeFriendsView }/>
                        }
                    </Column>
                </Grid>
                <Flex alignItems="center" className="rooms-button-container px-2 py-1">
                    <Flex alignItems="center" className="user-container pe-3" gap={ 2 } onClick={ event => CreateLinkEvent(`navigator/search/hotel_view/owner:${ userProfile.username }`) }>
                        <i className="icon icon-rooms2" />
                        <Text bold className="font-size-11" underline pointer>{ LocalizeText('extendedprofile.rooms') }</Text>
                    </Flex>
                    <Flex alignItems="center" className="ps-3" gap={ 2 } onClick={ event => setVisible(prevValue => !prevValue) }>
                        <i className="icon icon-groups" />
                        <Text bold className="font-size-11" underline pointer>{ LocalizeText('extendedprofile.groups') }</Text>
                    </Flex>
                </Flex>
                { isVisible &&
                <GroupsContainerView className="profile-groups-height" fullWidth itsMe={ userProfile.id === GetSessionDataManager().userId } groups={ userProfile.groups } onLeaveGroup={ onLeaveGroup } /> }
            </NitroCardContentView>
        </NitroCardView>

    )
}
