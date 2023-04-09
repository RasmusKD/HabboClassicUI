import { GetGuestRoomResultEvent, NavigatorSearchComposer, RateFlatMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetRoomEngine, LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, classNames, Column, Flex, Text, TransitionAnimation, TransitionAnimationTypes } from '../../../../common';
import { useMessageEvent, useNavigator, useRoom } from '../../../../hooks';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { navigatorData = null } = useNavigator();
    const { roomSession = null } = useRoom();
    const [ show, setShow ] = useState(false);
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
        }
    }

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
    });

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

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);

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
                <><Flex gap={ 0 } center className="nitro-room-tools p-2 ">
                    <Column center gap={ 0 }>
                        <Base pointer title={ LocalizeText('room.settings.button.text') } className={`icon icon-cog-settings${hoveredTool === "settings" ? " hover" : ""}${activeTool === "settings" ? " active" : ""}`} onClick={ () => handleToolClick('settings') } />
                        <Base pointer title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } className={classNames('icon', !isZoomedIn && 'icon-zoom-less-settings', isZoomedIn && 'icon-zoom-more-settings', hoveredTool === 'zoom' && 'hover', activeTool === 'zoom' && 'active')} />
                        <Base pointer title={ LocalizeText('room.chathistory.button.text') } onClick={ () => { handleToolClick('chat_history'); setShow(!show);} } className={`icon icon-chat-history-settings${hoveredTool === "chat_history" ? " hover" : ""}${activeTool === "chat_history" ? " active" : ""}`}/>
                        { navigatorData.canRate &&
                    <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } className={`icon icon-like-room-settings${hoveredTool === "like_room" ? " hover" : ""}${activeTool === "like_room" ? " active" : ""}`}/> }
                        <Base pointer title={ LocalizeText('navigator.embed.caption') } onClick={ () => handleToolClick('toggle_room_link') } className={`icon icon-link-room-settings${hoveredTool === "toggle_room_link" ? " hover" : ""}${activeTool === "toggle_room_link" ? " active" : ""}`}/>
                    </Column>
                    <Column gap={ 0 }>
                        <Flex className="w-100">
                            <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('settings') } onMouseEnter={() => handleHover('settings')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('settings')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.settings.button.text') }</Text>
                        </Flex>
                        <Flex className="w-100">
                            <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('zoom') } onMouseEnter={() => handleHover('zoom')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('zoom')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.zoom.button.text') }</Text>
                        </Flex>
                        <Flex className="w-100">
                            <Text underline className='w-100 font-settings' onClick={ () => { handleToolClick('chat_history') } } onMouseEnter={() => handleHover('chat_history')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('chat_history')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.chathistory.button.text') }</Text></Flex>
                        { navigatorData.canRate &&
                    <Flex className="w-100">
                        <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('like_room') } onMouseEnter={() => handleHover('like_room')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('like_room')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('room.like.button.text') }</Text>
                    </Flex> }
                        <Flex className="w-100">
                            <Text underline className='w-100 font-settings' onClick={ () => handleToolClick('toggle_room_link') } onMouseEnter={() => handleHover('toggle_room_link')} onMouseLeave={() => { handleHover(null); setActiveTool(null);}} onMouseDown={() => setActiveTool('toggle_room_link')} onMouseUp={() => setActiveTool(null)}>{ LocalizeText('navigator.embed.caption') }</Text>
                        </Flex>
                    </Column>


                </Flex><Column justifyContent="end">
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
