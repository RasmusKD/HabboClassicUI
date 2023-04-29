import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer, ToggleFavoriteGroup } from '../../../api';
import { AutoGrid, Base, Column, Flex, Grid, GridProps, LayoutBadgeImageView, LayoutGridAchievementBadges, Text, Tooltip } from '../../../common';
import { useMessageEvent } from '../../../hooks';
import { GroupInformationView } from '../../groups/views/GroupInformationView';

interface GroupsContainerViewProps extends GridProps
{
    itsMe: boolean;
    groups: HabboGroupEntryData[];
    onLeaveGroup: () => void;
}

export const GroupsContainerView: FC<GroupsContainerViewProps> = props =>
{
    const { itsMe = null, groups = null, onLeaveGroup = null, overflow = 'hidden', gap = 2, ...rest } = props;
    const [ selectedGroupId, setSelectedGroupId ] = useState<number>(null);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    const groupsCount = groups ? groups.length : 0;

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event =>
    {
        const parser = event.getParser();

        if(!selectedGroupId || (selectedGroupId !== parser.id) || parser.flag) return;

        setGroupInformation(parser);
    });

    useEffect(() =>
    {
        if(!selectedGroupId) return;

        SendMessageComposer(new GroupInformationComposer(selectedGroupId, false));
    }, [ selectedGroupId ]);

    useEffect(() =>
    {
        setGroupInformation(null);

        if(groups.length > 0)
        {
            setSelectedGroupId(prevValue =>
            {
                if(prevValue === groups[0].groupId)
                {
                    SendMessageComposer(new GroupInformationComposer(groups[0].groupId, false));
                }

                return groups[0].groupId;
            });
        }
    }, [ groups ]);

    if(!groups || !groups.length)
    {
        return (
            <Column center fullHeight>
                <Column className="profile-grey-bg-2 py-3 px-4">
                    <Text small> { LocalizeText('extendedprofile.nogroups.user') }</Text>
                    <Flex justifyContent="center" gap={ 4 }>
                        <Base className="no-group-spritesheet image-1" />
                        <Base className="no-group-spritesheet image-2" />
                        <Base className="no-group-spritesheet image-3" />
                    </Flex>
                    <Text small>{ LocalizeText('extendedprofile.nogroups.info') }</Text>
                </Column>
            </Column>
        );
    }

    return (
        <Grid overflow={ overflow } gap={ 2 } { ...rest }>
            <Column alignItems="center" size={ 2 } overflow="auto">
                <Text className='font-size-11'><b>{ LocalizeText('extendedprofile.groups.count') }</b> { groupsCount }</Text>
                <AutoGrid overflow={ null } columnCount={ 1 } columnMinHeight={ 50 } className="user-groups-container">
                    { groups.map((group, index) =>
                    {
                        return (
                            <LayoutGridAchievementBadges gap={ 0 } key={ index } overflow="unset" itemActive={ (selectedGroupId === group.groupId) } onClick={ () => setSelectedGroupId(group.groupId) } className="p-1">
                                { itsMe &&
                                <Tooltip windowId="UserProfile" isDraggable={true} content={ LocalizeText(group.favourite ? 'group.clearfavourite' : 'group.makefavourite') }><i className={ 'position-absolute heart-placement z-index-1 icon icon-group-' + (group.favourite ? 'favorite' : 'not-favorite') } onClick={ () => ToggleFavoriteGroup(group) } /></Tooltip> }
                                <LayoutBadgeImageView badgeCode={ group.badgeCode } isGroup={ true } />
                            </LayoutGridAchievementBadges>
                        )
                    }) }
                </AutoGrid>
            </Column>
            <Column size={ 10 } overflow="hidden">
                { groupInformation &&
                    <GroupInformationView groupInformation={ groupInformation } onClose={ onLeaveGroup } /> }
            </Column>
        </Grid>
    );
}
//group.makefavourite group.clearfavourite
//skift vennelistehover
