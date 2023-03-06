import { ModMessageMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { ISelectedUser, SendMessageComposer } from '../../../../api';
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useNotification } from '../../../../hooks';

interface ModToolsUserSendMessageViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

export const ModToolsUserSendMessageView: FC<ModToolsUserSendMessageViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;
    const [ message, setMessage ] = useState('');
    const { simpleAlert = null } = useNotification();

    if(!user) return null;

    const sendMessage = () =>
    {
        if(message.trim().length === 0)
        {
            simpleAlert('Please write a message to user.', null, null, null, 'Error', null);

            return;
        }

        SendMessageComposer(new ModMessageMessageComposer(user.userId, message, -999));

        onCloseClick();
    }

    return (
        <NitroCardView className="nitro-mod-tools-user-message no-resize" theme="modtool-windows" windowPosition={ DraggableWindowPosition.TOP_CENTER }>
            <NitroCardHeaderView headerText={ 'Send Besked' } onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Text>Besked til: { user.username }</Text>
                <textarea spellCheck="false" className="form-control h-100" value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Button className="volter-button" fullWidth onClick={ sendMessage }>Send besked</Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
