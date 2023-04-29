import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, GetClubMemberLevel } from '../../../../api';
import { Column, Flex, Grid, Text } from '../../../../common';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}
    const MIN_VALUE: number = 1;
    const MAX_VALUE: number = 99;

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

    const getLocalizationKeyForChatSetting = (setting, value) => {
      switch (setting) {
        case 'mode':
          return value === RoomChatSettings.CHAT_MODE_FREE_FLOW
            ? 'navigator.roomsettings.chat.mode.free.flow'
            : 'navigator.roomsettings.chat.mode.line.by.line';
        case 'weight':
          switch (value) {
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL:
              return 'navigator.roomsettings.chat.bubbles.width.normal';
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN:
              return 'navigator.roomsettings.chat.bubbles.width.thin';
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE:
              return 'navigator.roomsettings.chat.bubbles.width.wide';
          }
          break;
        case 'speed':
          switch (value) {
            case RoomChatSettings.CHAT_SCROLL_SPEED_FAST:
              return 'navigator.roomsettings.chat.speed.fast';
            case RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL:
              return 'navigator.roomsettings.chat.speed.normal';
            case RoomChatSettings.CHAT_SCROLL_SPEED_SLOW:
              return 'navigator.roomsettings.chat.speed.slow';
          }
          break;
        case 'protection':
          switch (value) {
            case RoomChatSettings.FLOOD_FILTER_LOOSE:
              return 'navigator.roomsettings.chat.flood.loose';
            case RoomChatSettings.FLOOD_FILTER_NORMAL:
              return 'navigator.roomsettings.chat.flood.normal';
            case RoomChatSettings.FLOOD_FILTER_STRICT:
              return 'navigator.roomsettings.chat.flood.strict';
          }
          break;
        default:
          return '';
      }
    };

    const updateValue = (event) =>
    {
        let valueStr = event.target.value.replace(/^0+/, '');
        let value = parseInt(valueStr);

        if (isNaN(value) || valueStr === '') value = 1;

        value = Math.max(value, MIN_VALUE);
        value = Math.min(value, MAX_VALUE);

        if (value === chatDistance) return;

        setChatDistance(value);
    }


    useEffect(() =>
    {
        setChatDistance(roomData.chatSettings.distance);
    }, [ roomData.chatSettings ]);

    return (
        <>
            <Column gap={ 1 }>
                <Text small bold>{ LocalizeText('navigator.roomsettings.vip_settings') }</Text>
                <Text className="small-lineheight">{ LocalizeText('navigator.roomsettings.vip.info') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-form-check-input" type="checkbox" checked={ roomData.hideWalls } onChange={ event => { handleChange('hide_walls', event.target.checked) }}/>
                    <Text small>{ LocalizeText('navigator.roomsettings.hide_walls') }</Text>
                </Flex>
                <Column gap={ 2 }>
                <select className={`form-select form-select-sm ${isWallsOpen ? 'active' : ''}`} value={ roomData.wallThickness } onChange={ event => { handleChange('wall_thickness', event.target.value) }} onClick={() => handleSelectToggle('Walls')} onBlur={() => setIsWallsOpen(false)}>
                    <option value="0">{ LocalizeText('navigator.roomsettings.wall_thickness.normal') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.wall_thickness.thick') }</option>
                    <option value="-1">{ LocalizeText('navigator.roomsettings.wall_thickness.thin') }</option>
                    <option value="-2">{ LocalizeText('navigator.roomsettings.wall_thickness.thinnest') }</option>
                </select>
                <select className={`form-select form-select-sm ${isFloorOpen ? 'active' : ''}`} value={ roomData.floorThickness } onChange={ event => { handleChange('floor_thickness', event.target.value) }} onClick={() => handleSelectToggle('Floor')} onBlur={() => setIsFloorOpen(false)}>
                    <option value="0">{ LocalizeText('navigator.roomsettings.floor_thickness.normal') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.floor_thickness.thick') }</option>
                    <option value="-1">{ LocalizeText('navigator.roomsettings.floor_thickness.thin') }</option>
                    <option value="-2">{ LocalizeText('navigator.roomsettings.floor_thickness.thinnest') }</option>
                </select>
            </Column>
            </Column>
                <Column gap={ 1 }>
                    <Text small bold>{ LocalizeText('navigator.roomsettings.chat_settings') }</Text>
                    <Text className="small-lineheight">{ LocalizeText('navigator.roomsettings.chat_settings.info') }</Text>
                    <Column gap={ 2 }>
                    <div className={`customSelect ${isChat1Open ? 'active' : ''}`} onClick={() => handleSelectToggle('Chat1')} onBlur={() => setIsChat1Open(false)} tabIndex={0}>
                      <div className="selectButton">{LocalizeText(getLocalizationKeyForChatSetting('mode', roomData.chatSettings.mode))}</div>
                      <div className="options">
                        <div className={`option ${isChat1Open && roomData.chatSettings.mode === 0 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_MODE_FREE_FLOW} onClick={() => handleChange('bubble_mode', RoomChatSettings.CHAT_MODE_FREE_FLOW)}>{LocalizeText('navigator.roomsettings.chat.mode.free.flow')}</div>
                        <div className={`option ${isChat1Open && roomData.chatSettings.mode === 1 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_MODE_LINE_BY_LINE} onClick={() => handleChange('bubble_mode', RoomChatSettings.CHAT_MODE_LINE_BY_LINE)}>{LocalizeText('navigator.roomsettings.chat.mode.line.by.line')}</div>
                      </div>
                    </div>
                    <div className={`customSelect ${isChat2Open ? 'active' : ''}`} onClick={() => handleSelectToggle('Chat2')} onBlur={() => setIsChat2Open(false)} tabIndex={0}>
                      <div className="selectButton">{LocalizeText(getLocalizationKeyForChatSetting('weight', roomData.chatSettings.weight))}</div>
                      <div className="options">
                        <div className={`option ${isChat2Open && roomData.chatSettings.weight === 1 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL} onClick={() => handleChange('chat_weight', RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL)}>{LocalizeText('navigator.roomsettings.chat.bubbles.width.normal')}</div>
                        <div className={`option ${isChat2Open && roomData.chatSettings.weight === 2 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN} onClick={() => handleChange('chat_weight', RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN)}>{LocalizeText('navigator.roomsettings.chat.bubbles.width.thin')}</div>
                        <div className={`option ${isChat2Open && roomData.chatSettings.weight === 0 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE} onClick={() => handleChange('chat_weight', RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE)}>{LocalizeText('navigator.roomsettings.chat.bubbles.width.wide')}</div>
                      </div>
                    </div>
                    <div className={`customSelect ${isChat3Open ? 'active' : ''}`} onClick={() => handleSelectToggle('Chat3')} onBlur={() => setIsChat3Open(false)} tabIndex={0}>
                      <div className="selectButton">{LocalizeText(getLocalizationKeyForChatSetting('speed', roomData.chatSettings.speed))}</div>
                      <div className="options">
                        <div className={`option ${isChat3Open && roomData.chatSettings.speed === 0 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_SCROLL_SPEED_FAST} onClick={() => handleChange('bubble_speed', RoomChatSettings.CHAT_SCROLL_SPEED_FAST)}>{LocalizeText('navigator.roomsettings.chat.speed.fast')}</div>
                        <div className={`option ${isChat3Open && roomData.chatSettings.speed === 1 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL} onClick={() => handleChange('bubble_speed', RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL)}>{LocalizeText('navigator.roomsettings.chat.speed.normal')}</div>
                        <div className={`option ${isChat3Open && roomData.chatSettings.speed === 2 ? 'selected' : ''}`} value={RoomChatSettings.CHAT_SCROLL_SPEED_SLOW} onClick={() => handleChange('bubble_speed', RoomChatSettings.CHAT_SCROLL_SPEED_SLOW)}>{LocalizeText('navigator.roomsettings.chat.speed.slow')}</div>
                      </div>
                    </div>
                    <div className={`customSelect ${isChat4Open ? 'active' : ''}`} onClick={() => handleSelectToggle('Chat4')} onBlur={() => setIsChat4Open(false)} tabIndex={0}>
                      <div className="selectButton">{LocalizeText(getLocalizationKeyForChatSetting('protection', roomData.chatSettings.protection))}</div>
                      <div className="options">
                        <div className={`option ${isChat4Open && roomData.chatSettings.protection === 2 ? 'selected' : ''}`} value={RoomChatSettings.FLOOD_FILTER_LOOSE} onClick={() => handleChange('flood_protection', RoomChatSettings.FLOOD_FILTER_LOOSE)}>{LocalizeText('navigator.roomsettings.chat.flood.loose')}</div>
                        <div className={`option ${isChat4Open && roomData.chatSettings.protection === 1 ? 'selected' : ''}`} value={RoomChatSettings.FLOOD_FILTER_NORMAL} onClick={() => handleChange('flood_protection', RoomChatSettings.FLOOD_FILTER_NORMAL)}>{LocalizeText('navigator.roomsettings.chat.flood.normal')}</div>
                        <div className={`option ${isChat4Open && roomData.chatSettings.protection === 0 ? 'selected' : ''}`} value={RoomChatSettings.FLOOD_FILTER_STRICT} onClick={() => handleChange('flood_protection', RoomChatSettings.FLOOD_FILTER_STRICT)}>{LocalizeText('navigator.roomsettings.chat.flood.strict')}</div>
                      </div>
                    </div>
                    <Flex alignItems="center" gap={ 1 }>
                        <input type="number" className="form-control form-control6 form-control-sm hearing-distance-size" value={ chatDistance } onChange={ event => updateValue(event) } onBlur={ event => handleChange('chat_distance', chatDistance) } onInput={(event) => { event.target.value = event.target.value.replace(/^0+/, ''); }}/>
                        <Text small>{ LocalizeText('navigator.roomsettings.chat_settings.hearing.distance') }</Text>
                    </Flex>
                    </Column>
                </Column>
        </>
    );
}
