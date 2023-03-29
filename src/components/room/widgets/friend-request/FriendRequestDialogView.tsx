import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetUserProfile, LocalizeText, MessengerRequest } from '../../../../api';
import { Base, Button, Column, Flex, Text, Tooltip } from '../../../../common';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FriendRequestDialogView: FC<{ roomIndex: number, request: MessengerRequest, hideFriendRequest: (userId: number) => void, requestResponse: (requestId: number, flag: boolean) => void }> = props =>
{
    const { roomIndex = -1, request = null, hideFriendRequest = null, requestResponse = null } = props;

    return (
        <ObjectLocationView objectId={ roomIndex } category={ RoomObjectCategory.UNIT }>
            <Base className="nitro-friend-request-dialog p-2">
                <Column>
                    <Flex justifyContent="between" gap={ 2 }>
                        <Tooltip content={ LocalizeText('guide.help.common.profile.tooltip') }><Base className="friend-req-position nitro-friends-spritesheet icon-profile-sm cursor-pointer" onClick={ event => GetUserProfile(request.requesterUserId) }/></Tooltip>
                        <Tooltip content={ LocalizeText('guide.help.common.profile.tooltip') }><Text small bold variant="white" className="w-100" onClick={ event => GetUserProfile(request.requesterUserId) }>{ LocalizeText('widget.friendrequest.from', [ 'username' ], [ request.name ]) }</Text></Tooltip>
                        <i className="friend-req-close" onClick={ event => hideFriendRequest(request.requesterUserId) } />
                    </Flex>
                    <Flex alignItems="center">
                        <Text small className="cursor-pointer" underline onClick={ event => requestResponse(request.requesterUserId, false) }>{ LocalizeText('widget.friendrequest.decline') }</Text>
                        <Button variant="thicker" className="accept-friend-btn" onClick={ event => requestResponse(request.requesterUserId, true) }><i className="nitro-friends-spritesheet icon-accept"/>{ LocalizeText('widget.friendrequest.accept') }</Button>
                    </Flex>
                </Column>
            </Base>
        </ObjectLocationView>
    );
}
