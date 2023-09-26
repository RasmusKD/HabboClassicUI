import { GroupAdminGiveComposer, GroupAdminTakeComposer, GroupConfirmMemberRemoveEvent, GroupConfirmRemoveMemberComposer, GroupMemberParser, GroupMembersComposer, GroupMembersEvent, GroupMembershipAcceptComposer, GroupMembershipDeclineComposer, GroupMembersParser, GroupRank, GroupRemoveMemberComposer, ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetSessionDataManager, GetUserProfile, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../../api';
import { Base, Button, Column, Flex, Grid, LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text, Tooltip } from '../../../common';
import { useMessageEvent, useNotification } from '../../../hooks';

export const GroupMembersView: FC<{}> = props =>
{
    const [ groupId, setGroupId ] = useState<number>(-1);
    const [ levelId, setLevelId ] = useState<number>(-1);
    const [ membersData, setMembersData ] = useState<GroupMembersParser>(null);
    const [ pageId, setPageId ] = useState<number>(-1);
    const [ totalPages, setTotalPages ] = useState<number>(0);
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ removingMemberName, setRemovingMemberName ] = useState<string>(null);
    const { showConfirm = null } = useNotification();

    const [ isOpen, setIsOpen ] = useState(false);

        function handleSelectClick() {
            setIsOpen(!isOpen);
        }

        function handleSelectBlur() {
            setIsOpen(false);
        }

    const getRankDescription = (member: GroupMemberParser) =>
    {
        if(member.rank === GroupRank.OWNER) return 'group.members.owner';

        if(membersData.admin)
        {
            if(member.rank === GroupRank.ADMIN) return 'group.members.removerights';

            if(member.rank === GroupRank.MEMBER) return 'group.members.giverights';
        }

        return '';
    }

    const refreshMembers = useCallback(() =>
    {
        if((groupId === -1) || (levelId === -1) || (pageId === -1)) return;

        SendMessageComposer(new GroupMembersComposer(groupId, pageId, searchQuery, levelId));
    }, [ groupId, levelId, pageId, searchQuery ]);

    const toggleAdmin = (member: GroupMemberParser) =>
    {
        if(!membersData.admin || (member.rank === GroupRank.OWNER)) return;

        if(member.rank !== GroupRank.ADMIN) SendMessageComposer(new GroupAdminGiveComposer(membersData.groupId, member.id));
        else SendMessageComposer(new GroupAdminTakeComposer(membersData.groupId, member.id));

        refreshMembers();
    }

    const acceptMembership = (member: GroupMemberParser) =>
    {
        if(!membersData.admin || (member.rank !== GroupRank.REQUESTED)) return;

        SendMessageComposer(new GroupMembershipAcceptComposer(membersData.groupId, member.id));

        refreshMembers();
    }

    const removeMemberOrDeclineMembership = (member: GroupMemberParser) =>
    {
        if(!membersData.admin) return;

        if(member.rank === GroupRank.REQUESTED)
        {
            SendMessageComposer(new GroupMembershipDeclineComposer(membersData.groupId, member.id));

            refreshMembers();

            return;
        }

        setRemovingMemberName(member.name);
        SendMessageComposer(new GroupConfirmRemoveMemberComposer(membersData.groupId, member.id));
    }

    useMessageEvent<GroupMembersEvent>(GroupMembersEvent, event =>
    {
        const parser = event.getParser();

        setMembersData(parser);
        setLevelId(parser.level);
        setTotalPages(Math.ceil(parser.totalMembersCount / parser.pageSize));
    });

    useMessageEvent<GroupConfirmMemberRemoveEvent>(GroupConfirmMemberRemoveEvent, event =>
    {
        const parser = event.getParser();

        showConfirm(LocalizeText(((parser.furnitureCount > 0) ? 'group.kickconfirm.desc' : 'group.kickconfirm_nofurni.desc'), [ 'user', 'amount' ], [ removingMemberName, parser.furnitureCount.toString() ]), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(membersData.groupId, parser.userId));

            refreshMembers();
        }, null);

        setRemovingMemberName(null);
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                const groupId = (parseInt(parts[1]) || -1);
                const levelId = (parseInt(parts[2]) || 3);

                setGroupId(groupId);
                setLevelId(levelId);
                setPageId(0);
            },
            eventUrlPrefix: 'group-members/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        setPageId(0);
    }, [ groupId, levelId, searchQuery ]);

    useEffect(() =>
    {
        if((groupId === -1) || (levelId === -1) || (pageId === -1)) return;

        SendMessageComposer(new GroupMembersComposer(groupId, pageId, searchQuery, levelId));
    }, [ groupId, levelId, pageId, searchQuery ]);

    useEffect(() =>
    {
        if(groupId === -1) return;

        setLevelId(-1);
        setMembersData(null);
        setTotalPages(0);
        setSearchQuery('');
        setRemovingMemberName(null);
    }, [ groupId ]);

    if((groupId === -1) || !membersData) return null;

    return (
        <NitroCardView id='GroupMembers' className="nitro-group-members no-resize" theme="primary" overflow="visible">
            <NitroCardHeaderView headerText={ LocalizeText('group.members.title', [ 'groupName' ], [ membersData ? membersData.groupTitle : '' ]) } onCloseClick={ event => setGroupId(-1) } />
            <NitroCardContentView overflow="hidden">
                <Flex gap={ 1 }>
                    <Flex center className="group-badge group-badge-margin">
                        <LayoutBadgeImageView badgeCode={ membersData.badge } isGroup={ true } className="mx-auto d-block"/>
                    </Flex>
                    <Column fullWidth gap={ 1 }>
                        <input spellCheck="false" type="text" className="form-control form-control-sm w-100" placeholder={ LocalizeText('group.members.searchinfo') } value={ searchQuery } onChange={ event => setSearchQuery(event.target.value) } />
                        <div className={`customSelect margin-top-auto ${isOpen ? 'active' : ''}`} onClick={handleSelectClick} onBlur={handleSelectBlur} tabIndex={0}>
                            <div className="selectButton">{LocalizeText(`group.members.search.${ levelId === 1 ? 'admins' : levelId === 2 ? 'pending' : 'all' }`)}</div>
                            <div className="options">
                                <div value={0} className={`option ${isOpen && 0 === levelId ? 'selected' : ''}`} onClick={() => setLevelId(0)}> {LocalizeText('group.members.search.all')} </div>
                                <div value={1} className={`option ${isOpen && 1 === levelId ? 'selected' : ''}`} onClick={() => setLevelId(1)}> {LocalizeText('group.members.search.admins')} </div>
                                <div value={2} className={`option ${isOpen && 2 === levelId ? 'selected' : ''}`} onClick={() => setLevelId(2)}> {LocalizeText('group.members.search.pending')} </div>
                            </div>
                        </div>
                    </Column>
                </Flex>
                <Grid columnCount={ 2 } overflow="auto" className="nitro-group-members-list-grid group-member-height">
                    { membersData.result.map((member, index) =>
                    {
                        return (
                            <Flex key={ index } overflow="hidden" className="member-list-item bg-white">
                                <Tooltip windowId="GroupMembers" isDraggable={true} content={ LocalizeText('group.members.showinfo') }><div className="avatar-head cursor-pointer" onClick={ () => GetUserProfile(member.id) }>
                                    <LayoutAvatarImageView figure={ member.figure } headOnly={ true } direction={ 2 } />
                                </div></Tooltip>
                                <Column className="group-text" grow gap={ 0 }>
                                    <Tooltip windowId="GroupMembers" isDraggable={true} content={ LocalizeText('group.members.showinfo') }><Text bold small pointer className="group-font-size2" onClick={ event => GetUserProfile(member.id) }>{ member.name }</Text></Tooltip>
                                    { membersData.admin && (member.rank !== GroupRank.OWNER) && (member.id !== GetSessionDataManager().userId) &&
                                    <Flex>
                                        <Tooltip windowId="GroupMembers" isDraggable={true} content={ LocalizeText(member.rank === GroupRank.REQUESTED ? 'group.members.reject' : 'group.members.kick') }><Base pointer className="group-remove-icon" onClick={ event => removeMemberOrDeclineMembership(member) }></Base></Tooltip>
                                    </Flex> }
                                    { (member.rank !== GroupRank.REQUESTED) &&
                                    <Flex>
                                        <Tooltip windowId="GroupMembers" isDraggable={true} content={ LocalizeText(getRankDescription(member)) }><Base pointer={ membersData.admin } className={ `icon icon-group-small-${ ((member.rank === GroupRank.OWNER) ? 'owner' : (member.rank === GroupRank.ADMIN) ? 'admin' : (membersData.admin && (member.rank === GroupRank.MEMBER)) ? 'not-admin' : '') }` } onClick={ event => toggleAdmin(member) } /></Tooltip>
                                        <Tooltip windowId="GroupMembers" isDraggable={true} content={ LocalizeText('group.members.showinfo') }><Text onClick={ event => GetUserProfile(member.id) } pointer small italics variant="muted" className="group-font-size">{ LocalizeText('group.members.since', [ 'date' ], [ member.joinedAt ]) }</Text></Tooltip>
                                    </Flex>
                                    }
                                    { membersData.admin && (member.rank === GroupRank.REQUESTED) &&
                                    <Flex>
                                        <Text className='accept-membership' pointer onClick={ event => acceptMembership(member) }>{ LocalizeText('group.members.accept') }</Text>
                                    </Flex>}
                                </Column>
                            </Flex>
                        );
                    }) }
                </Grid>
                <Flex gap={ 1 } className="margin-top-auto" justifyContent="between" alignItems="center">
                    <Button className="btn-thicker button-size" disabled={ (membersData.pageIndex === 0) } onClick={ event => setPageId(prevValue => (prevValue - 1)) }>
                    { (membersData.pageIndex) !== 0 &&
                        <i className="icon icon-context-arrow-left-black mt-auto mb-auto"/>}
                    </Button>
                    <Text small>
                        { LocalizeText('group.members.pageinfo', [ 'amount', 'page', 'totalPages' ], [ membersData.totalMembersCount.toString(), (membersData.pageIndex + 1).toString(), totalPages.toString() ]) }
                    </Text>
                    <Button className="btn-thicker button-size" disabled={ (membersData.pageIndex === (totalPages - 1)) } onClick={ event => setPageId(prevValue => (prevValue + 1)) }>
                    { (membersData.pageIndex !== (totalPages - 1)) &&
                        <i className="icon icon-context-arrow-right-black mt-auto mb-auto"/>}
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
