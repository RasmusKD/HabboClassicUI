import { RoomDeleteComposer, RoomSettingsSaveErrorEvent, RoomSettingsSaveErrorParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CreateLinkEvent, GetMaxVisitorsList, IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Column, Flex, Text, useFilteredInput } from '../../../../common';
import { useMessageEvent, useNavigator, useNotification } from '../../../../hooks';

const ROOM_NAME_MIN_LENGTH = 3;
const ROOM_NAME_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 255;
const TAGS_MAX_LENGTH = 22;

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean | string[]) => void;
    onClose: () => void;
}

export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null, onClose = null } = props;
    const [ roomName, setRoomName ] = useState<string>('');
    const [ roomDescription, setRoomDescription ] = useState<string>('');
    const [ roomTag1, setRoomTag1 ] = useState<string>('');
    const [ roomTag2, setRoomTag2 ] = useState<string>('');
    const [ tagIndex, setTagIndex ] = useState(0);
    const [ typeError, setTypeError ] = useState<string>('');
    const { showConfirm = null } = useNotification();
    const { categories = null } = useNavigator();

    const roomNameInputChange = useFilteredInput(roomName, setRoomName);
    const roomDescriptionInputChange = useFilteredInput(roomDescription, setRoomDescription);
    const roomTag1InputChange = useFilteredInput(roomTag1, setRoomTag1);
    const roomTag2InputChange = useFilteredInput(roomTag2, setRoomTag2);

    useMessageEvent<RoomSettingsSaveErrorEvent>(RoomSettingsSaveErrorEvent, event =>
    {
        const parser = event.getParser();

        if (!parser) return;

        switch (parser.code)
        {
            case RoomSettingsSaveErrorParser.ERROR_INVALID_TAG:
                setTypeError('navigator.roomsettings.unacceptablewords');
                break;
            case RoomSettingsSaveErrorParser.ERROR_NON_USER_CHOOSABLE_TAG:
                setTypeError('navigator.roomsettings.nonuserchoosabletag');
                break;
            default:
                setTypeError('');
                break;
        }
    });

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isVisitorsCountOpen, setIsVisitorsCountOpen] = useState(false);
    const [isTradesSettingOpen, setIsTradesSettingOpen] = useState(false);

    const handleSelectToggle = (selectName: string) => {
        switch (selectName) {
            case 'category':
                setIsCategoryOpen(!isCategoryOpen);
                break;
            case 'visitorsCount':
                setIsVisitorsCountOpen(!isVisitorsCountOpen);
                break;
            case 'tradesSetting':
                setIsTradesSettingOpen(!isTradesSettingOpen);
                break;
            default:
                break;
        }
    };

    const deleteRoom = () =>
    {
        showConfirm(LocalizeText('navigator.roomsettings.deleteroom.confirm.message', [ 'room_name' ], [ roomData.roomName ] ), () =>
        {
            SendMessageComposer(new RoomDeleteComposer(roomData.roomId));

            if(onClose) onClose();

            CreateLinkEvent('navigator/search/myworld_view');
        },
        null, null, null, LocalizeText('navigator.roomsettings.deleteroom.confirm.title'));
    }

    const saveRoomName = () =>
    {
        if((roomName === roomData.roomName) || (roomName.length < ROOM_NAME_MIN_LENGTH) || (roomName.length > ROOM_NAME_MAX_LENGTH)) return;

        handleChange('name', roomName);
    }

    const saveRoomDescription = () =>
    {
        if((roomDescription === roomData.roomDescription) || (roomDescription.length > DESC_MAX_LENGTH)) return;

        handleChange('description', roomDescription);
    }

    const saveTags = (index: number) =>
    {
        if(index === 0 && (roomTag1 === roomData.tags[0]) || (roomTag1.length > TAGS_MAX_LENGTH)) return;

        if(index === 1 && (roomTag2 === roomData.tags[1]) || (roomTag2.length > TAGS_MAX_LENGTH)) return;

        if(roomTag1 === '' && roomTag2 !== '') setRoomTag2('');

        setTypeError('');
        setTagIndex(index);
        handleChange('tags', (roomTag1 === '' && roomTag2 !== '') ? [ roomTag2 ] : [ roomTag1, roomTag2 ]);
    }

    useEffect(() =>
    {
        setRoomName(roomData.roomName);
        setRoomDescription(roomData.roomDescription);
        setRoomTag1((roomData.tags.length > 0 && roomData.tags[0]) ? roomData.tags[0] : '');
        setRoomTag2((roomData.tags.length > 0 && roomData.tags[1]) ? roomData.tags[1] : '');
    }, [ roomData ]);


    return (
        <>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.roomname') }</Text>
                <Column fullWidth gap={ 0 }>
                    <input spellCheck="false" className="form-control form-control-sm form-control5" value={ roomName } maxLength={ ROOM_NAME_MAX_LENGTH } onChange={roomNameInputChange} onBlur={ saveRoomName } />
                    { (roomName.length < ROOM_NAME_MIN_LENGTH) &&
                        <Text bold small variant="danger">
                            { LocalizeText('navigator.roomsettings.roomnameismandatory') }
                        </Text> }
                </Column>
            </Column>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.roomsettings.desc') }</Text>
                <textarea spellCheck="false" className="form-control form-control-sm trophy-text2 form-control5" value={ roomDescription } maxLength={ DESC_MAX_LENGTH } onChange={roomDescriptionInputChange} onBlur={ saveRoomDescription } />
            </Column>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.category') }</Text>
                <select className={`form-select form-select-sm ${isCategoryOpen ? 'active' : ''}`} value={ roomData.categoryId } onChange={ event => handleChange('category', event.target.value) } onClick={() => handleSelectToggle('category')} onBlur={() => setIsCategoryOpen(false)}>
                    { categories && categories.map(category => <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>) }
                </select>
            </Column>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.maxvisitors') }</Text>
                <select className={`form-select form-select-sm ${isVisitorsCountOpen ? 'active' : ''}`} value={ roomData.userCount } onChange={ event => handleChange('max_visitors', event.target.value) } onClick={() => handleSelectToggle('visitorsCount')} onBlur={() => setIsVisitorsCountOpen(false)}>
                    { GetMaxVisitorsList && GetMaxVisitorsList.map(value => <option key={ value } value={ value }>{ value }</option>) }
                </select>
            </Column>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.tradesettings') }</Text>
                <select className={`form-select form-select-sm ${isTradesSettingOpen ? 'active' : ''}`} value={ roomData.tradeState } onChange={ event => handleChange('trade_state', event.target.value) } onClick={() => handleSelectToggle('tradesSetting')} onBlur={() => setIsTradesSettingOpen(false)}>
                    <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                    <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                </select>
            </Column>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.roomsettings.allow_walk_through') }</Text>
                <select className={`form-select form-select-sm`} value={ roomData.allowWalkthrough } onChange={ event => handleChange('allow_walkthrough', Number(event.target.value)) }>
                    <option value="0">{ LocalizeText('navigator.roomsettings.allow_walk_through.state0') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.allow_walk_through.state1') }</option>
                    <option value="2">{ LocalizeText('navigator.roomsettings.allow_walk_through.state2') }</option>
                    <option value="3">{ LocalizeText('navigator.roomsettings.allow_walk_through.state3') }</option>
                    <option value="4">{ LocalizeText('navigator.roomsettings.allow_walk_through.state4') }</option>
                </select>
            </Column>
            <Column gap={ 1 }>
                <Text className='basis-font'>{ LocalizeText('navigator.tags') }</Text>
                <Flex gap={ 1 }>
                    <Column fullWidth gap={ 0 }>
                        <input spellCheck="false" maxLength={ 22 } className="form-control form-control5 form-control-sm tag-size" value={ roomTag1 } onChange={roomTag1InputChange} onBlur={ () => saveTags(0) } />
                        { (roomTag1.length > TAGS_MAX_LENGTH) &&
                            <Text bold small variant="danger">
                                { LocalizeText('navigator.roomsettings.toomanycharacters') }
                            </Text> }
                        { (tagIndex === 0 && typeError != '') &&
                            <Text bold small variant="danger">
                                { LocalizeText(typeError) }
                            </Text> }
                    </Column>
                    <Column fullWidth gap={ 0 }>
                        <input spellCheck="false" maxLength={ 22 } className="form-control form-control5 form-control-sm tag-size" value={ roomTag2 } onChange={roomTag2InputChange} onBlur={ () => saveTags(1) } />
                        { (roomTag2.length > TAGS_MAX_LENGTH) &&
                            <Text bold small variant="danger">
                                { LocalizeText('navigator.roomsettings.toomanycharacters') }
                            </Text> }
                        { (tagIndex === 1 && typeError != '') &&
                        <Text bold small variant="danger">
                            { LocalizeText(typeError) }
                        </Text> }
                    </Column>
                </Flex>
            </Column>
            <Text small variant="danger" underline bold pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ deleteRoom }>
                <FaTimes className="fa-icon" />
                { LocalizeText('navigator.roomsettings.delete') }
            </Text>
        </>
    );
};
