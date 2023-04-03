import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, GetClubMemberLevel } from '../../../../api';
import { Column, Flex, Grid, Text } from '../../../../common';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsVipChatTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ chatDistance, setChatDistance ] = useState<number>(0);
    const [isChat1Open, setIsChat1Open] = useState(false);
    const [isChat2Open, setIsChat2Open] = useState(false);
    const [isChat3Open, setIsChat3Open] = useState(false);
    const [isChat4Open, setIsChat4Open] = useState(false);
    const [isWallsOpen, setIsWallsOpen] = useState(false);
    const [isFloorOpen, setIsFloorOpen] = useState(false);
    const HC = GetClubMemberLevel();
    const disabled = HC ? '' : 'muted-color';

    const handleSelectToggle = (selectName) => {
        switch (selectName) {
            case 'Chat1':
                setIsChat1Open(!isChat1Open);
                break;
            case 'Chat2':
                setIsChat2Open(!isChat2Open);
                break;
            case 'Chat3':
                setIsChat3Open(!isChat3Open);
                break;
            case 'Chat4':
                setIsChat4Open(!isChat4Open);
                break;
            case 'Walls':
                setIsWallsOpen(!isWallsOpen);
                break;
            case 'Floor':
                setIsFloorOpen(!isFloorOpen);
                break;
            default:
                break;
        }
    };

    useEffect(() =>
    {
        setChatDistance(roomData.chatSettings.distance);
    }, [ roomData.chatSettings ]);

    return (
        <>
            <Column gap={ 0 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.vip.caption') }</Text>
                <Text small>{ LocalizeText('navigator.roomsettings.vip.info') }</Text>
            </Column>
                <Column gap={ 1 }>
                    <Text small bold>{ LocalizeText('navigator.roomsettings.vip_settings') }</Text>
                    <Flex className={disabled} alignItems="center" gap={ 1 }>
                        <input disabled={!HC} className="flash-form-check-input" type="checkbox" checked={ roomData.hideWalls } onChange={ event => { if (HC) handleChange('hide_walls', event.target.checked) }} />
                        <Text small>{ LocalizeText('navigator.roomsettings.hide_walls') }</Text>
                    </Flex>
                    <Column className={disabled} gap={ 2 }>
                    <select disabled={!HC} className={`form-select form-select-sm ${isWallsOpen ? 'active' : ''}`} value={ roomData.wallThickness } onChange={ event => { if (HC) handleChange('wall_thickness', event.target.value) }} onClick={() => handleSelectToggle('Walls')} onBlur={() => setIsWallsOpen(false)}>
                        <option value="0">{ LocalizeText('navigator.roomsettings.wall_thickness.normal') }</option>
                        <option value="1">{ LocalizeText('navigator.roomsettings.wall_thickness.thick') }</option>
                        <option value="-1">{ LocalizeText('navigator.roomsettings.wall_thickness.thin') }</option>
                        <option value="-2">{ LocalizeText('navigator.roomsettings.wall_thickness.thinnest') }</option>
                    </select>
                    <select disabled={!HC} className={`form-select form-select-sm ${isFloorOpen ? 'active' : ''}`} value={ roomData.floorThickness } onChange={ event => { if (HC) handleChange('floor_thickness', event.target.value) }} onClick={() => handleSelectToggle('Floor')} onBlur={() => setIsFloorOpen(false)}>
                        <option value="0">{ LocalizeText('navigator.roomsettings.floor_thickness.normal') }</option>
                        <option value="1">{ LocalizeText('navigator.roomsettings.floor_thickness.thick') }</option>
                        <option value="-1">{ LocalizeText('navigator.roomsettings.floor_thickness.thin') }</option>
                        <option value="-2">{ LocalizeText('navigator.roomsettings.floor_thickness.thinnest') }</option>
                    </select>
                </Column>
            </Column>
                <Column gap={ 1 }>
                    <Text small bold>{ LocalizeText('navigator.roomsettings.chat_settings') }</Text>
                    <Text small>{ LocalizeText('navigator.roomsettings.chat_settings.info') }</Text>
                    <Column gap={ 2 }>
                    <select className={`form-select form-select-sm ${isChat1Open ? 'active' : ''}`} value={ roomData.chatSettings.mode } onChange={ event => handleChange('bubble_mode', event.target.value) } onClick={() => handleSelectToggle('Chat1')} onBlur={() => setIsChat1Open(false)}>
                        <option value={ RoomChatSettings.CHAT_MODE_FREE_FLOW }>{ LocalizeText('navigator.roomsettings.chat.mode.free.flow') }</option>
                        <option value={ RoomChatSettings.CHAT_MODE_LINE_BY_LINE }>{ LocalizeText('navigator.roomsettings.chat.mode.line.by.line') }</option>
                    </select>
                    <select className={`form-select form-select-sm ${isChat2Open ? 'active' : ''}`} value={ roomData.chatSettings.weight } onChange={ event => handleChange('chat_weight', event.target.value) } onClick={() => handleSelectToggle('Chat2')} onBlur={() => setIsChat2Open(false)}>
                        <option value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL }>{ LocalizeText('navigator.roomsettings.chat.bubbles.width.normal') }</option>
                        <option value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN }>{ LocalizeText('navigator.roomsettings.chat.bubbles.width.thin') }</option>
                        <option value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE }>{ LocalizeText('navigator.roomsettings.chat.bubbles.width.wide') }</option>
                    </select>
                    <select className={`form-select form-select-sm ${isChat3Open ? 'active' : ''}`} value={ roomData.chatSettings.speed } onChange={ event => handleChange('bubble_speed', event.target.value) } onClick={() => handleSelectToggle('Chat3')} onBlur={() => setIsChat3Open(false)}>
                        <option value={ RoomChatSettings.CHAT_SCROLL_SPEED_FAST }>{ LocalizeText('navigator.roomsettings.chat.speed.fast') }</option>
                        <option value={ RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL }>{ LocalizeText('navigator.roomsettings.chat.speed.normal') }</option>
                        <option value={ RoomChatSettings.CHAT_SCROLL_SPEED_SLOW }>{ LocalizeText('navigator.roomsettings.chat.speed.slow') }</option>
                    </select>
                    <select className={`form-select form-select-sm ${isChat4Open ? 'active' : ''}`} value={ roomData.chatSettings.protection } onChange={ event => handleChange('flood_protection', event.target.value) } onClick={() => handleSelectToggle('Chat4')} onBlur={() => setIsChat4Open(false)}>
                        <option value={ RoomChatSettings.FLOOD_FILTER_LOOSE }>{ LocalizeText('navigator.roomsettings.chat.flood.loose') }</option>
                        <option value={ RoomChatSettings.FLOOD_FILTER_NORMAL }>{ LocalizeText('navigator.roomsettings.chat.flood.normal') }</option>
                        <option value={ RoomChatSettings.FLOOD_FILTER_STRICT }>{ LocalizeText('navigator.roomsettings.chat.flood.strict') }</option>
                    </select>
                    <Flex alignItems="center" gap={ 1 }>
                        <input type="number" min="0" max="99" className="form-control form-control6 form-control-sm hearing-distance-size" value={ chatDistance } onChange={ event => setChatDistance(event.target.valueAsNumber) } onBlur={ event => handleChange('chat_distance', chatDistance) } />
                        <Text small>{ LocalizeText('navigator.roomsettings.chat_settings.hearing.distance') }</Text>
                    </Flex>
                    </Column>
                </Column>
        </>
    );
}
