import { GetGuestRoomResultEvent, NavigatorSearchComposer, RateFlatMessageComposer, RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetRoomEngine, LocalizeText, SendMessageComposer, SetLocalStorage, TryVisitRoom } from '../../../../api';
import { Base, classNames, Column, Flex, Text, Tooltip, TransitionAnimation, TransitionAnimationTypes, classNames } from '../../../../common';
import { useMessageEvent, useNavigator, useRoom } from '../../../../hooks';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ isOpenHistory, setIsOpenHistory ] = useState<boolean>(false);
    const [ roomHistory, setRoomHistory ] = useState<{ roomId: number, roomName: string }[]>([]);
    const { navigatorData = null } = useNavigator();
    const { roomSession = null } = useRoom();
    const [show, setShow] = useState(() => {
        const savedShow = localStorage.getItem("showState");
        return savedShow ? JSON.parse(savedShow) : false;
    });
    const [hideTools, setHideTools] = useState(false);
    const [hoveredTool, setHoveredTool] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const handleHover = (tool: string | null) => {
        setHoveredTool(tool);
    };

    const handleToolClick = (action: string, value?: string) => {
        switch(action)
        {
            case 'settings':
                CreateLinkEvent('navigator/toggle-room-info');
                return;
            case 'zoom':
                setIsZoomedIn(prevValue =>
                {
                    let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomSession.roomId, 1);

                    if(!prevValue) scale /= 2;
                    else scale *= 2;

                    GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomSession.roomId, 1, scale);

                    return !prevValue;
                });
                return;
            case 'chat_history':
                CreateLinkEvent('chat-history/toggle');
                return;
            case 'like_room':
                SendMessageComposer(new RateFlatMessageComposer(1));
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
            case 'navigator_search_tag':
                CreateLinkEvent(`navigator/search/${ value }`);
                SendMessageComposer(new NavigatorSearchComposer('hotel_view', `tag:${ value }`));
                return;
            case 'room_history':
                if (roomHistory.length > 0) setIsOpenHistory(prevValue => !prevValue);
                return;
            case 'room_history_back':
                TryVisitRoom(roomHistory[roomHistory.findIndex(room => room.roomId === navigatorData.currentRoomId) - 1].roomId);
                return;
            case 'room_history_next':
                TryVisitRoom(roomHistory[roomHistory.findIndex(room => room.roomId === navigatorData.currentRoomId) + 1].roomId);
                return;
        }
    }
    const onChangeRoomHistory = (roomId: number, roomName: string) =>
    {
        let newStorage = JSON.parse(window.localStorage.getItem('nitro.room.history'));
        if (newStorage && newStorage.filter( (room: RoomDataParser) => room.roomId === roomId ).length > 0) return;
        if (newStorage && newStorage.length >= 10) newStorage.shift();
        const newData = !newStorage ? [ { roomId: roomId, roomName: roomName } ] : [ ...newStorage, { roomId: roomId, roomName: roomName } ];
        setRoomHistory(newData);
        return SetLocalStorage('nitro.room.history', newData );
    }

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);

        onChangeRoomHistory(parser.data.roomId, parser.data.roomName);
    });

     useEffect(() =>
    {
        const handleTabClose = () =>
        {
            if (JSON.parse(window.localStorage.getItem('nitro.room.history'))) window.localStorage.removeItem('nitro.room.history');
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () =>
        {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    useEffect(() => {
        if (show) {
            setHideTools(false);
            const timer = setTimeout(() => setHideTools(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

    }, [ roomName, roomOwner, roomTags, show ]);

    useEffect(() => {
        localStorage.setItem("showState", JSON.stringify(show));
    }, [show]);

    useEffect(() =>
    {
        setRoomHistory(JSON.parse(window.localStorage.getItem('nitro.room.history')) ?? []);
    }, [ ]);

    return (
        <Flex gap={ 2 } className="nitro-room-tools-container">
            <div className="btn-toggle toggle-roomtool d-flex align-items-center" onClick={ () => setShow(!show) }>
                <div className={ classNames('toggle-icon', (!show && 'right'), (show && 'left')) }/>
            </div>
            { !show && (
                <Column justifyContent="end">
                    <TransitionAnimation type={ TransitionAnimationTypes.SLIDE_LEFT } inProp={ isOpen } timeout={ 300 }>
                        <Column center gap={ 0 }>
                            <Column className="nitro-room-tools-info py-2 px-3" gap={ 0 }>
                                <Column gap={ 0 }>
                                    <Text wrap variant="white overflow-hidden" fontSize={ 4 }>{ roomName }</Text>
                                    { roomOwner &&
                                    <Text className='owner-name-color'>af { roomOwner }</Text>}
                                </Column>
                                { roomTags && roomTags.length > 0 &&
                                                    <Flex className='tag-wrap'>
                                    { roomTags.map((tag, index) => <Text key={ index } pointer className="tag-bg2" onClick={ () => handleToolClick('navigator_search_tag', tag) }>#{ tag }</Text>) }
                                                    </Flex> }
                            </Column>
                        </Column>
                    </TransitionAnimation>
                </Column>
            ) }
            { show && (
                <><Column center className="nitro-room-tools p-2 " gap={ 2 }>
                    <Flex gap={ 0 }>
                        <Column center gap={ 0 }>
                            <Tooltip content={ LocalizeText('room.settings.button.tooltip') }><Base pointer className={`icon icon-cog-settings${hoveredTool === "settings" ? " hover" : ""}${activeTool === "settings" ? " active" : ""}`} onClick={ () => handleToolClick('settings') } /></Tooltip>
                            <Tooltip content={ LocalizeText('toolbar.icon.tooltip.zoom') }><Base pointer onClick={ () => handleToolClick('zoom') } className={classNames('icon', !isZoomedIn && 'icon-zoom-less-settings', isZoomedIn && 'icon-zoom-more-settings', hoveredTool === 'zoom' && 'hover', activeTool === 'zoom' && 'active')} /></Tooltip>
                            <Tooltip content={ LocalizeText('chat.history.button.tooltip') }><Base pointer onClick={ () => { handleToolClick('chat_history'); setShow(!show);} } className={`icon icon-chat-history-settings${hoveredTool === "chat_history" ? " hover" : ""}${activeTool === "chat_history" ? " active" : ""}`}/></Tooltip>
                            { navigatorData.canRate &&
                            <Tooltip content={ LocalizeText('room.like.button.tooltip') }><Base pointer onClick={ () => handleToolClick('like_room') } className={`icon icon-like-room-settings${hoveredTool === "like_room" ? " hover" : ""}${activeTool === "like_room" ? " active" : ""}`}/></Tooltip> }
                            <Tooltip content={ LocalizeText('navigator.embed.caption') }><Base pointer onClick={ () => handleToolClick('toggle_room_link') } className={`icon icon-link-room-settings${hoveredTool === "toggle_room_link" ? " hover" : ""}${activeTool === "toggle_room_link" ? " active" : ""}`}/></Tooltip>
                        </Column>
                        <Column gap={ 0 }>
                            <Tooltip content={ LocalizeText('room.settings.button.tooltip') }><Flex className="w-100">
                                <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('settings') } onMouseEnter={() => handleHover('settings')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('settings')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.settings.button.text') }</Text>
                            </Flex></Tooltip>
                            <Tooltip content={ LocalizeText('toolbar.icon.tooltip.zoom') }><Flex className="w-100">
                                <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('zoom') } onMouseEnter={() => handleHover('zoom')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('zoom')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.zoom.button.text') }</Text>
                            </Flex></Tooltip>
                            <Tooltip content={ LocalizeText('chat.history.button.tooltip') }><Flex className="w-100">
                                <Text underline className='w-100 font-settings' onClick={ () => { handleToolClick('chat_history') } } onMouseEnter={() => handleHover('chat_history')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('chat_history')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.chathistory.button.text') }</Text></Flex></Tooltip>
                            { navigatorData.canRate &&
                            <Tooltip content={ LocalizeText('room.like.button.tooltip') }><Flex className="w-100">
                                <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('like_room') } onMouseEnter={() => handleHover('like_room')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('like_room')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.like.button.text') }</Text>
                            </Flex></Tooltip> }
                            <Tooltip content={ LocalizeText('navigator.embed.caption') }><Flex className="w-100">
                                <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('toggle_room_link') } onMouseEnter={() => handleHover('toggle_room_link')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('toggle_room_link')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('navigator.embed.caption') }</Text>
                            </Flex></Tooltip>
                        </Column>
                    </Flex>
                    <Flex justifyContent="center">
                        <Tooltip content={ LocalizeText('room.history.button.back.tooltip') }><Base pointer={ roomHistory.length > 1 && roomHistory[0]?.roomId !== navigatorData.currentRoomId } className={ `icon ${ (roomHistory?.length === 0 || roomHistory[0]?.roomId === navigatorData.currentRoomId) ? 'icon-room-history-back-disabled' : 'icon-room-history-back-enabled' }` } onClick={ () => (roomHistory?.length === 0 || roomHistory[0]?.roomId === navigatorData.currentRoomId) ? null : handleToolClick('room_history_back') } /></Tooltip>
                        <Tooltip content={ LocalizeText('room.history.button.tooltip') }><Base pointer={ roomHistory?.length > 0 } className={ `icon ${ roomHistory?.length === 0 ? 'icon-room-history-disabled' : 'icon-room-history-enabled' } margin-button-history` } onClick={ () => roomHistory?.length === 0 ? null : handleToolClick('room_history') } /></Tooltip>
                        <Tooltip content={ LocalizeText('room.history.button.forward.tooltip') }><Base pointer={ roomHistory.length > 1 && roomHistory[roomHistory.length - 1]?.roomId !== navigatorData.currentRoomId } className={ `icon ${ (roomHistory?.length === 0 || roomHistory[roomHistory.length - 1]?.roomId === navigatorData.currentRoomId) ? 'icon-room-history-next-disabled' : 'icon-room-history-next-enabled' }` } onClick={ () => (roomHistory?.length === 0 || roomHistory[roomHistory.length - 1]?.roomId === navigatorData.currentRoomId) ? null : handleToolClick('room_history_next') } /></Tooltip>
                    </Flex>
                    <Flex className="nitro-room-tools-history" style={ { bottom: !navigatorData.canRate ? '159px' : '183px' } }>
                        <TransitionAnimation type={ TransitionAnimationTypes.SLIDE_LEFT } inProp={ isOpenHistory }>
                            <Column center>
                                <Column className="nitro-room-tools margin-history py-2 px-3">
                                    <Column gap={ 1 }>
                                        { (roomHistory.length > 0) && roomHistory.map(history =>
                                        {
                                            return <Text small key={ history.roomId } bold={ history.roomId === navigatorData.currentRoomId } variant={ history.roomId === navigatorData.currentRoomId ? 'white' : 'muted' } pointer onClick={ () => TryVisitRoom(history.roomId) }>{ history.roomName }</Text>;
                                        }) }
                                    </Column>
                                </Column>
                            </Column>
                        </TransitionAnimation>
                    </Flex>
                </Column>
                <Column justifyContent="end">
                    <TransitionAnimation type={ TransitionAnimationTypes.SLIDE_LEFT } inProp={ !hideTools } timeout={ 300 }>
                        <Column center gap={ 0 }>
                            <Column className="nitro-room-tools-info py-2 px-3" gap={ 0 }>
                                <Column gap={ 0 }>
                                    <Text wrap variant="white overflow-hidden" fontSize={ 4 }>{ roomName }</Text>
                                    { roomOwner &&
                                    <Text className='owner-name-color'>af { roomOwner }</Text>}
                                </Column>
                                { roomTags && roomTags.length > 0 &&
                                        <Flex className='tag-wrap'>
                                            { roomTags.map((tag, index) => <Text key={ index } pointer className="tag-bg2">#{ tag }</Text>) }
                                        </Flex> }
                            </Column>
                        </Column>
                    </TransitionAnimation>
                </Column></>
            ) }
        </Flex>
    );
}
