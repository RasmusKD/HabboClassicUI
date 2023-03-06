import { GetModeratorRoomInfoMessageComposer, ModerateRoomMessageComposer, ModeratorActionMessageComposer, ModeratorRoomInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, SendMessageComposer, TryVisitRoom } from '../../../../api';
import { Button, Column, DraggableWindowPosition, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface ModToolsRoomViewProps
{
    roomId: number;
    onCloseClick: () => void;
}

export const ModToolsRoomView: FC<ModToolsRoomViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;
    const [ infoRequested, setInfoRequested ] = useState(false);
    const [ loadedRoomId, setLoadedRoomId ] = useState(null);
    const [ name, setName ] = useState(null);
    const [ desc, setDesc ] = useState(null);
    const [ ownerId, setOwnerId ] = useState(null);
    const [ ownerName, setOwnerName ] = useState(null);
    const [ ownerInRoom, setOwnerInRoom ] = useState(false);
    const [ usersInRoom, setUsersInRoom ] = useState(0);
    const [ kickUsers, setKickUsers ] = useState(false);
    const [ lockRoom, setLockRoom ] = useState(false);
    const [ changeRoomName, setChangeRoomName ] = useState(false);
    const [ message, setMessage ] = useState('');

    const handleClick = (action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'alert_only':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_ALERT, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
            case 'send_message':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_MESSAGE, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
        }
    }

    useMessageEvent<ModeratorRoomInfoEvent>(ModeratorRoomInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.flatId !== roomId) return;

        setLoadedRoomId(parser.data.flatId);
        setName(parser.data.room.name);
        setOwnerId(parser.data.ownerId);
        setOwnerName(parser.data.ownerName);
        setOwnerInRoom(parser.data.ownerInRoom);
        setUsersInRoom(parser.data.userCount);
    });

    useEffect(() =>
    {
        if(infoRequested) return;

        SendMessageComposer(new GetModeratorRoomInfoMessageComposer(roomId));
        setInfoRequested(true);
    }, [ roomId, infoRequested, setInfoRequested ]);

    return (
        <NitroCardView className="nitro-mod-tools-room no-resize" theme="modtool-windows" windowPosition={ DraggableWindowPosition.TOP_CENTER }>
            <NitroCardHeaderView headerText={ 'Rumværktøj' } onCloseClick={ event => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Column gap={ 0 } className="mod-content p-2">
                    <Text gfbold>{ name }</Text>
                    <Text>{ desc }</Text>
                </Column>
                <Flex gap={ 2 } className="mod-content p-2">
                    <Column justifyContent="center" grow gap={ 1 }>
                        <Flex alignItems="center" gap={ 1 }>
                            <Text gfbold className="">Rum ejer:</Text>
                            <Text underline pointer truncate>{ ownerName }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text gfbold className="">Brugere i rum:</Text>
                            <Text>{ usersInRoom }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text gfbold className="">Ejer i rum:</Text>
                            <Text>{ ownerInRoom ? 'Ja' : 'Nej' }</Text>
                        </Flex>
                    </Column>
                    <Column gap={ 1 }>
                        <Button className="volter-button" onClick={ event => TryVisitRoom(roomId) }>Gå til rum</Button>
                        <Button className="volter-button" onClick={ event => CreateLinkEvent(`mod-tools/open-room-chatlog/${ roomId }`) }>Chatlog</Button>
                    </Column>
                </Flex>
                <Column className="mod-content p-2" gap={ 1 }>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-input" type="checkbox" checked={ kickUsers } onChange={ event => setKickUsers(event.target.checked) } />
                        <Text>Smid alle ud</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-input" type="checkbox" checked={ lockRoom } onChange={ event => setLockRoom(event.target.checked) } />
                        <Text>Sæt dørklokke på</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-input" type="checkbox" checked={ changeRoomName } onChange={ event => setChangeRoomName(event.target.checked) }/>
                        <Text>Skift rum navn til (upassende - hotellets ledelse)</Text>
                    </Flex>
                </Column>
                <textarea spellCheck="false" className="form-control message-input p-1" placeholder="Skriv en obligatorisk besked til brugerne i dette tekstfelt..." value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Flex justifyContent="between">
                    <Button className="volter-button" onClick={ event => handleClick('send_message') }>Send Advarsel</Button>
                    <Button className="volter-button" onClick={ event => handleClick('alert_only') }>Send kun besked</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
