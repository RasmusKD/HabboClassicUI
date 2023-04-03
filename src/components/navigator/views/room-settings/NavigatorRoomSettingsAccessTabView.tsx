import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IRoomData, LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsAccessTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ password, setPassword ] = useState<string>('');
    const [ isTryingPassword, setIsTryingPassword ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);

    const saveRoomPassword = () => {
        if (!isTryingPassword || (password.length <= 0)) return;

        handleChange('password', password);
    }

    useEffect(() => {
        if (roomData && roomData.password) {
            setPassword(roomData.password);
        } else {
            setPassword('');
        }
        setIsTryingPassword(false);
    }, [roomData]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Column gap={ 0 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.roomaccess.caption') }</Text>
                <Text small>{ LocalizeText('navigator.roomsettings.roomaccess.info') }</Text>
            </Column>
            <Column overflow="auto">
                <Column gap={ 1 }>
                    <Text small bold>{ LocalizeText('navigator.roomsettings.doormode') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-radio-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.OPEN_STATE) && !isTryingPassword } onChange={ event => handleChange('lock_state', RoomDataParser.OPEN_STATE) } />
                        <Text small>{ LocalizeText('navigator.roomsettings.doormode.open') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-radio-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.DOORBELL_STATE) && !isTryingPassword } onChange={ event => handleChange('lock_state', RoomDataParser.DOORBELL_STATE) } />
                        <Text small>{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-radio-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.INVISIBLE_STATE) && !isTryingPassword } onChange={ event => handleChange('lock_state', RoomDataParser.INVISIBLE_STATE) } />
                        <Text small>{ LocalizeText('navigator.roomsettings.doormode.invisible') }</Text>
                    </Flex>
                    <Flex fullWidth gap={ 1 }>
                        <input className="flash-form-check-radio-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.PASSWORD_STATE) || isTryingPassword } onChange={ event => setIsTryingPassword(event.target.checked) } />
                        { !isTryingPassword && (roomData.lockState !== RoomDataParser.PASSWORD_STATE) &&
                            <Text className='password-bottom' small>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text> }
                        { (isTryingPassword || (roomData.lockState === RoomDataParser.PASSWORD_STATE)) &&
                            <Column gap={ 1 }>
                                <Text small>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text>
                                <Text small>{ LocalizeText('navigator.roomsettings.password') }</Text>
                                <Flex className={`input-icon-wrapper ${password.length > 0 ? 'password-bottom2' : ''}`} gap={ 1 }>
                                        <input spellCheck="false" type="text" className={`form-control form-control5 form-control-sm password-size ${showPassword ? '' : 'password-font'}`} value={ password } onChange={ event => setPassword(event.target.value) } onFocus={ event => setIsTryingPassword(true) } onBlur={ saveRoomPassword }/>
                                        <Text small pointer className="d-flex justify-content-center align-items-center gap-1" onClick={toggleShowPassword}>
                                            {showPassword ? <FaEyeSlash className="fa-icon eye-position" /> : <FaEye className="fa-icon eye-position" />}
                                        </Text>
                                </Flex>
                                { isTryingPassword && (password.length <= 0) &&
                                    <Text small variant="danger">
                                        { LocalizeText('navigator.roomsettings.passwordismandatory') }
                                    </Text> }
                            </Column> }
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text small bold>{ LocalizeText('navigator.roomsettings.pets') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-input" type="checkbox" checked={ roomData.allowPets } onChange={ event => handleChange('allow_pets', event.target.checked) } />
                        <Text small>{ LocalizeText('navigator.roomsettings.allowpets') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="flash-form-check-input" type="checkbox" checked={ roomData.allowPetsEat } onChange={ event => handleChange('allow_pets_eat', event.target.checked) } />
                        <Text small>{ LocalizeText('navigator.roomsettings.allowfoodconsume') }</Text>
                    </Flex>
                </Column>
            </Column>
        </>
    );
};