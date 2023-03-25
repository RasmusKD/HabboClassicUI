import { ILinkEventTracker, RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, MessengerFriend, RemoveLinkEventTracker, SendMessageComposer } from '../../../../api';
import { Column, Flex, NitroCardAccordionSetView, NitroCardAccordionSetView2, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { NitroCardAccordionSetInnerView } from '../../../../common/card/accordion/NitroCardAccordionSetInnerView';
import { useFriends } from '../../../../hooks';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';
import { FriendsRemoveConfirmationView } from './FriendsListRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsListRoomInviteView';
import { FriendsSearchView } from './FriendsListSearchView';

export const FriendsListView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isHovering, setIsHovering ] = useState({});

    const handleHover = (index, value) => {
        setIsHovering(prevValue => ({ ...prevValue, [index]: value }));
    };
    const [ isSearch, setIsSearch ] = useState(false);
    const [ isFriends, setIsFriends ] = useState(false);
    const [ isRequest, setIsRequest ] = useState(false);
    const [ isScrollbarFriends, setIsScrollbarFriends ] = useState(false);
    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false);
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false);
    const { onlineFriends = [], offlineFriends = [], requests = [], requestFriend = null, acceptingAllRequests } = useFriends();

        const handleAccordionSetViewChange = (isExpanded) => {
      if (isExpanded) {
        setIsScrollbarFriends(true);
      } else {
        setIsScrollbarFriends(false);
      }
    };

    const handleAccordionSetViewChange2 = (isExpanded) => {
      if (isExpanded) {
        setIsScrollbarFriends(false);
      } else {
        setIsScrollbarFriends(true);
      }
    };

    const removeFriendsText = useMemo(() =>
    {
        if(!selectedFriendsIds || !selectedFriendsIds.length) return '';

        const userNames: string[] = [];

        for(const userId of selectedFriendsIds)
        {
            let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId);

            if(!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId);

            if(!existingFriend) continue;

            userNames.push(existingFriend.name);
        }

        return LocalizeText('friendlist.removefriendconfirm.userlist', [ 'user_names' ], [ userNames.join(', ') ]);
    }, [ offlineFriends, onlineFriends, selectedFriendsIds ]);

   const LinkText = useMemo(() =>
   {
       if(!selectedFriendsIds || !selectedFriendsIds.length) return null;

       const userNames: string[] = [];

       for(const userId of selectedFriendsIds)
       {
           let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId);

           if(!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId);

           if(!existingFriend) continue;

           userNames.push(existingFriend.name);
       }

       return userNames.join('');
   }, [ offlineFriends, onlineFriends, selectedFriendsIds ]);

    const selectFriend = useCallback((userId: number) =>
    {
        if(userId < 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const existingUserIdIndex: number = newValue.indexOf(userId);

            if(existingUserIdIndex > -1)
            {
                newValue.splice(existingUserIdIndex, 1)
            }
            else
            {
                newValue.push(userId);
            }

            return newValue;
        });
    }, [ setSelectedFriendsIds ]);

    const sendRoomInvite = (message: string) =>
    {
        if(!selectedFriendsIds.length || !message || !message.length || (message.length > 255)) return;

        SendMessageComposer(new SendRoomInviteComposer(message, selectedFriendsIds));

        setShowRoomInvite(false);
    }

    const removeSelectedFriends = () =>
    {
        if(selectedFriendsIds.length === 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            SendMessageComposer(new RemoveFriendComposer(...prevValue));

            return [];
        });

        setShowRemoveFriendsConfirmation(false);
    }

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'togglefriends':
                        setIsVisible(prevValue => !prevValue);
                        setIsSearch(false);
                        setIsFriends(true);
                        setIsScrollbarFriends(true);

                        return;
                    case 'togglesearch':
                        setIsVisible(prevValue => !prevValue);
                        setIsSearch(true);
                        setIsFriends(false);
                        setIsScrollbarFriends(false);

                        return;
                    case 'request':
                        if(parts.length < 4) return;

                        requestFriend(parseInt(parts[2]), parts[3]);
                }
            },
            eventUrlPrefix: 'friends/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ requestFriend ]);

    if(!isVisible) return null;

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends" theme="friendlist">
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ event => setIsVisible(false) } />
                <NitroCardContentView overflow="hidden" gap={ 1 } className="text-black p-0">
                    <NitroCardAccordionView fullHeight className={`friendbars ${isScrollbarFriends ? 'something1' : 'something2'}` }>
                        <NitroCardAccordionSetView2 className="friend-headers" headerText={ LocalizeText('friendlist.friends') } onClick={handleAccordionSetViewChange} isExpanded={ isFriends }>
                            <Column gap={ 0 }>
                            <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends') + ` (${ onlineFriends.length })` } isExpanded={ true }>
                                <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } setIsHovering={ setIsHovering }/>
                            </NitroCardAccordionSetInnerView>
                            <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${ offlineFriends.length })` } isExpanded={ true }>
                                <FriendsListGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } setIsHovering={ setIsHovering }/>
                            </NitroCardAccordionSetInnerView>
                            </Column>
                            <Column>
                            { selectedFriendsIds && selectedFriendsIds.length === 0 &&
                        <Flex gap={ 1 } className={ requests.length === 0 || acceptingAllRequests ? 'friend-active-tab p-1' : 'friend-active-tab p-1 friends-box-placement' }>
                            <div className="friend-follow-icon" />
                            <div className="friend-profile-icon" />
                            <div className="friend-delete-icon" />
                        </Flex> }
                            { selectedFriendsIds && selectedFriendsIds.length === 1 &&
                        <Flex gap={ 1 } className={ requests.length === 0 || acceptingAllRequests ? 'friend-active-tab p-1' : 'friend-active-tab p-1 friends-box-placement' }>
                            <div onMouseOver={() => handleHover(1, true)} onMouseOut={() => handleHover(1, false)} className="friend-follow-icon active" onClick={ () => setShowRoomInvite(true) } />
                            <div onMouseOver={() => handleHover(2, true)} onMouseOut={() => handleHover(2, false)} className="friend-profile-icon active" onClick={ event => window.open('https://habboclassic.dk/user/' + LinkText) }  />
                            <div onMouseOver={() => handleHover(3, true)} onMouseOut={() => handleHover(3, false)} className="friend-delete-icon active" onClick={ event => setShowRemoveFriendsConfirmation(true) } />
                        </Flex> }
                            { selectedFriendsIds && selectedFriendsIds.length > 1 &&
                        <Flex gap={ 1 } className={ requests.length === 0 || acceptingAllRequests ? 'friend-active-tab p-1' : 'friend-active-tab p-1 friends-box-placement' }>
                            <div onMouseOver={() => handleHover(1, true)} onMouseOut={() => handleHover(1, false)} className="friend-follow-icon active" onClick={ () => setShowRoomInvite(true) } />
                            <div className="friend-profile-icon" />
                            <div onMouseOver={() => handleHover(3, true)} onMouseOut={() => handleHover(3, false)} className="friend-delete-icon active" onClick={ event => setShowRemoveFriendsConfirmation(true) } />
                        </Flex>
                        }
                        </Column>
                        </NitroCardAccordionSetView2>
                        { !acceptingAllRequests &&
                        <FriendsListRequestView className="friend-headers" headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${ requests.length })` } onClick={handleAccordionSetViewChange} isExpanded={ isRequest } />}
                        <FriendsSearchView className="search-headers" headerText={ LocalizeText('people.search.title') } onClick={handleAccordionSetViewChange2} isExpanded={ isSearch } setIsHovering={ setIsHovering }/>
                    </NitroCardAccordionView>
                </NitroCardContentView>
                <div className="friendlist-bottom p-1">{isHovering[1] && <text className="text-padding">Send invitation</text>}{isHovering[2] && <text className="text-padding">Klik for at se forside profil</text>}{isHovering[3] && <text className="text-padding">Fjern ven</text>}{isHovering[4] && <text className="text-padding">Klik for at se profil</text>}{isHovering[5] && <text className="text-padding">{ LocalizeText('friendlist.tip.follow') }</text>}{isHovering[6] && <text className="text-padding">{ LocalizeText('friendlist.tip.im') }</text>}{isHovering[7] && <text className="text-padding">{ LocalizeText('infostand.link.relationship') }</text>}{isHovering[8] && <text className="text-padding">{ LocalizeText('friendlist.tip.addfriend') }</text>}</div>
            </NitroCardView>
            { showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation &&
                <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    );
};
