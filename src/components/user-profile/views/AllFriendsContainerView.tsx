import { FriendsStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, LocalizeText, RemoveLinkEventTracker, GetUserProfile } from '../../../api';
import { Base, Button, Column, Flex, Grid, LayoutAvatarImageView, Text, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Tooltip } from '../../../common';
import { useFriends } from '../../../hooks';

interface AllFriendsContainerViewProps {
    friends: FriendsStatusInfoMessageParser;
    username: string;
    onClose: () => void;
}

interface FriendInfo {
    friendId: number;
    friendName: string;
    friendFigure: string;
    friendRelation: number;
    friendOnline: number;
}

export const AllFriendsContainerView: FC<AllFriendsContainerViewProps> = props => {
    const { friends = null, username, onClose } = props;
    const [ userId, setUserId ] = useState<number>(-1);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const sortedFriends = [...(friends?.friendsList || [])].sort((a, b) => a._friendName.localeCompare(b._friendName));
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 14;
    const { canRequestFriend = null, requestFriend = null } = useFriends();
    const [colorTwo, setColorTwo] = useState(0);
    const [colorOne, setColorOne] = useState(0);
    const [order, setOrder] = useState<string>('default');
    const [isOpen, setIsOpen] = useState(false);

    function handleSelectClick() {
        setIsOpen(!isOpen);
    }

    function handleSelectBlur() {
        setIsOpen(false);
    }

    const onOrderChange = (value: string) => {
        setOrder(value);
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const headerText = username.endsWith('s')
        ? `${username}' Venner`
        : `${username}'s Venner`;

    const getIconClassName = (relation: number): string => {
        switch (relation) {
            case 1:
                return 'icon-heart';
            case 2:
                return 'icon-smile';
            case 3:
                return 'icon-bobba';
            case 4:
                return 'icon-poop';
            default:
                return '';  // or any default class if required
        }
    };

    const filteredFriends = useMemo(() => {
        let filteredList = [...sortedFriends];

        switch (activeTab) {
            case 'heart':
                filteredList = filteredList.filter(f => f._friendRelation === 1);
                break;
            case 'smile':
                filteredList = filteredList.filter(f => f._friendRelation === 2);
                break;
            case 'bobba':
                filteredList = filteredList.filter(f => f._friendRelation === 3);
                break;
            case 'poop':
                filteredList = filteredList.filter(f => f._friendRelation === 4);
                break;
            default:
                break;  // Keep all friends
        }

        if (searchTerm) {
            filteredList = filteredList.filter(friend => friend._friendName.toLowerCase().includes(searchTerm.toLowerCase()));
        }

         if (order === 'relation') {
             const customOrder = [1, 2, 3, 4, 0];
             filteredList.sort((a, b) => {
                 if (a._friendRelation !== b._friendRelation) {
                     return customOrder.indexOf(a._friendRelation) - customOrder.indexOf(b._friendRelation);
                 }
                 return a._friendName.localeCompare(b._friendName);
             });
         }

        return filteredList;
    }, [sortedFriends, searchTerm, activeTab]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredFriends.length / pageSize));
    }, [filteredFriends, pageSize]);

    const getPaginatedFriends = () => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredFriends.slice(startIndex, startIndex + pageSize);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, friends]);

    useEffect(() => {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => {
                const parts = url.split('/');
                if (parts.length < 2) return;
                const userId = (parseInt(parts[1]) || -1);
                setUserId(userId);
            },
            eventUrlPrefix: 'profile/friends/'
        };

        AddEventLinkTracker(linkTracker);
        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <NitroCardView id='ProfileFriends' className="profile-friends no-resize" theme="primary" overflow="visible">
            <NitroCardHeaderView headerText={headerText} onCloseClick={onClose} />
            <NitroCardTabsView>
                <NitroCardTabsItemView isActive={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                    All
                </NitroCardTabsItemView>
                <NitroCardTabsItemView isActive={activeTab === 'heart'} onClick={() => setActiveTab('heart')}>
                    <Base pointer className="nitro-friends-spritesheet icon-heart"/>
                </NitroCardTabsItemView>
                <NitroCardTabsItemView isActive={activeTab === 'smile'} onClick={() => setActiveTab('smile')}>
                    <Base pointer className="nitro-friends-spritesheet icon-smile"/>
                </NitroCardTabsItemView>
                <NitroCardTabsItemView isActive={activeTab === 'bobba'} onClick={() => setActiveTab('bobba')}>
                    <Base pointer className="nitro-friends-spritesheet icon-bobba"/>
                </NitroCardTabsItemView>
                <NitroCardTabsItemView isActive={activeTab === 'poop'} onClick={() => setActiveTab('poop')}>
                    <Base pointer className="nitro-friends-spritesheet icon-poop"/>
                </NitroCardTabsItemView>
            </NitroCardTabsView>
            <NitroCardContentView overflow="hidden">
            <Flex justifyContent="between" alignItems="center" gap={ 1 }>
                <input spellCheck="false" type="text" className="form-control form-control-sm w-100" placeholder={ LocalizeText('group.members.searchinfo') } value={ searchTerm } onChange={e => setSearchTerm(e.target.value)} />
                <div className={`form-select-profile-friends customSelect ${isOpen ? 'active' : ''}`} onClick={handleSelectClick} onBlur={handleSelectBlur} tabIndex={0}>
                    <div className="selectButton">{order === "default" ? "Navn A-Å" : "Efter Forhold"}</div>
                    <div className="options">
                        <div
                            value="default"
                            className={`option ${isOpen && order === "default" ? 'selected' : ''}`}
                            onClick={() => onOrderChange("default")}>
                            Navn A-Å
                        </div>
                        <div
                            value="relation"
                            className={`option ${isOpen && order === "relation" ? 'selected' : ''}`}
                            onClick={() => onOrderChange("relation")}>
                            Efter Forhold
                        </div>
                    </div>
                </div>
            </Flex>
            <Grid columnCount={ 2 } overflow="auto" className="profile-friends-list-grid group-member-height">
                    {getPaginatedFriends().map(friendInfo =>
                    <Flex overflow="hidden" className="profile-friends-item bg-white">
                        <Tooltip windowId="ProfileFriends" isDraggable={true} content={ LocalizeText('group.members.showinfo') }>
                            <div className="profile-friends-head cursor-pointer" onClick={ () => GetUserProfile(friendInfo._friendId) }>
                                <LayoutAvatarImageView figure={ friendInfo._friendFigure } headOnly={ true } direction={ 2 } />
                            </div>
                        </Tooltip>
                        <Base className={`profile-relation-position nitro-friends-spritesheet ${getIconClassName(friendInfo._friendRelation)}`} />
                        <i className={`icon icon-pf-${friendInfo._friendOnline ? 'online' : 'offline'} online-status-placement`} />
                        <Column className="group-text" gap={ 0 }>
                            <Tooltip windowId="ProfileFriends" isDraggable={true} content={ LocalizeText('group.members.showinfo') }>
                                <Text bold small pointer className="group-font-size2" onClick={ event => GetUserProfile(friendInfo._friendId) }>{ friendInfo._friendName }</Text>
                            </Tooltip>
                            { canRequestFriend(friendInfo._friendId) &&
                                <Text className="request-friend-text cursor-pointer" onClick={event => { requestFriend(friendInfo._friendId, friendInfo._friendName);}}>{ LocalizeText('extendedprofile.addasafriend') }</Text> }
                        </Column>
                    </Flex>)}
                </Grid>
                <Flex gap={ 1 } className="margin-top-auto" justifyContent="between" alignItems="center">
                    <Button className="btn-thicker button-size" disabled={ currentPage === 1 } onClick={prevPage}>
                        { (currentPage) !== 1 &&
                            <i className="icon icon-context-arrow-left-black mt-auto mb-auto"/>}
                        </Button>
                        <Text small>
                            { LocalizeText('group.members.pageinfo', [ 'amount', 'page', 'totalPages' ], [ filteredFriends.length.toString(), currentPage.toString(), totalPages.toString() ]) }
                        </Text>
                        <Button className="btn-thicker button-size" disabled={currentPage === totalPages} onClick={ nextPage }>
                        { (currentPage !== totalPages) &&
                            <i className="icon icon-context-arrow-right-black mt-auto mb-auto"/>}
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
