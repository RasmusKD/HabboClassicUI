import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Flex, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface FriendsRoomInviteViewProps
{
    selectedFriendsIds: number[];
    onCloseClick: () => void;
    sendRoomInvite: (message: string) => void;
}

export const FriendsRoomInviteView: FC<FriendsRoomInviteViewProps> = props =>
{
    const { selectedFriendsIds = null, onCloseClick = null, sendRoomInvite = null } = props;
    const [ roomInviteMessage, setRoomInviteMessage ] = useState<string>('');

    return (
        <NitroCardView className="nitro-friends-room-invite no-resize" uniqueKey="nitro-friends-room-invite" theme="friendlist">
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.invite.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                <Column className="form-control nitro-form friends-padding">
                <Text center>{ LocalizeText('friendlist.invite.summary', [ 'count' ], [ selectedFriendsIds.length.toString() ]) }</Text>
                <textarea spellCheck="false" className="form-control squared-friends-form" value={ roomInviteMessage } maxLength={ 255 } onChange={ event => setRoomInviteMessage(event.target.value) }></textarea>
                <Text center>{ LocalizeText('friendlist.invite.note') }</Text>
                </Column>
                <Flex gap={ 1 }>
                    <Button fullWidth className="volter-bold-button"  disabled={ ((roomInviteMessage.length === 0) || (selectedFriendsIds.length === 0)) } onClick={ () => sendRoomInvite(roomInviteMessage) }>{ LocalizeText('friendlist.invite.send') }</Button>
                    <Button fullWidth className="volter-button" onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
