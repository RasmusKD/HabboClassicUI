import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarEnterRoomView: FC<{}> = props =>
{
    const [ username, setUsername ] = useState('');
    const [ avatarMode, setAvatarMode ] = useState(0);
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam((avatarMode === 1) ? username : '');

    useEffect(() =>
    {
        setUsername(trigger.stringData);
        setAvatarMode(trigger.stringData ? 1 : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column className='wired-align' gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text gfbold>{ LocalizeText('wiredfurni.params.picktriggerer') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="avatarMode" id="avatarMode0" checked={ (avatarMode === 0) } onChange={ event => setAvatarMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.anyavatar') }</Text>
                </Flex>
                <Flex className={avatarMode === 0 ? 'wired-text-bottom' : ''} alignItems="center" gap={1}>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="avatarMode" id="avatarMode1" checked={ (avatarMode === 1) } onChange={ event => setAvatarMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.certainavatar') }</Text>
                </Flex>
                { (avatarMode === 1) &&
                    <input spellCheck="false" type="text" className="form-control wired-form wired-form2" value={ username } onChange={ event => setUsername(event.target.value) } /> }
            </Column>
        </WiredTriggerBaseView>
    );
}
