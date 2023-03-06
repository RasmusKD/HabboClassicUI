import { FriendlyTime, RequestFriendComposer, UserProfileParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, LayoutAvatarImageView, Text } from '../../../common';

interface UserContainerViewProps
{
    userProfile: UserProfileParser;
}

export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { userProfile = null } = props;
    const [ requestSent, setRequestSent ] = useState(userProfile.requestSent);
    const isOwnProfile = (userProfile.id === GetSessionDataManager().userId);
    const canSendFriendRequest = !requestSent && (!isOwnProfile && !userProfile.isMyFriend && !userProfile.requestSent);

    const addFriend = () =>
    {
        setRequestSent(true);

        SendMessageComposer(new RequestFriendComposer(userProfile.username));
    }

    useEffect(() =>
    {
        setRequestSent(userProfile.requestSent);
    }, [ userProfile ])

    return (
        <Flex gap={ 0 }>
            <Column center className="avatar-container">
                <LayoutAvatarImageView className='cropped-position' figure={ userProfile.figure } cropTransparency={ true } direction={ 2 } />
            </Column>
            <Column gap={ 0 }>
                <Column gap={ 0 }>
                    <Text bold className='font-size-profile'>{ userProfile.username }</Text>
                    <Text italics textBreak className='font-size-profile motto-height'>{ userProfile.motto }&nbsp;</Text>
                </Column>
                <Column gap={ 0 }>
                    <Text className='font-size-profile'>
                        <b>{ LocalizeText('extendedprofile.created') }</b> { userProfile.registration }
                    </Text>
                    <Text className='font-size-profile'>
                        <b>{ LocalizeText('extendedprofile.last.login') }</b> { FriendlyTime.format(userProfile.secondsSinceLastVisit, '.ago', 2) }
                    </Text>
                    <Text className='font-size-profile'>
                        <b>{ LocalizeText('extendedprofile.achievementscore') }</b> { userProfile.achievementPoints }
                    </Text>
                </Column>
                <Flex gap={ 1 }>
                    { userProfile.isOnline &&
                        <i className="icon icon-pf-online" /> }
                    { !userProfile.isOnline &&
                        <i className="icon icon-pf-offline" /> }
                    <Flex alignItems="center" gap={ 1 }>
                        { canSendFriendRequest &&
                            <Button className='add-friend-button' onClick={ addFriend }>{ LocalizeText('extendedprofile.addasafriend') }</Button> }
                        { !canSendFriendRequest &&
                            <>
                                <i className="icon icon-pf-tick" />
                                { isOwnProfile &&
                                    <Text bold small>{ LocalizeText('extendedprofile.me') }</Text> }
                                { userProfile.isMyFriend &&
                                    <Text bold small>{ LocalizeText('extendedprofile.friend') }</Text> }
                                { (requestSent || userProfile.requestSent) &&
                                    <Text small italics>{ LocalizeText('extendedprofile.friendrequestsent') }</Text> }
                            </> }
                    </Flex>
                </Flex>
            </Column>
        </Flex>
    )
}
