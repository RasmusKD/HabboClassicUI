import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerBotReachedAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(botName);

    useEffect(() =>
    {
        setBotName(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column className='wired-help-bottom' gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
        </WiredTriggerBaseView>
    );
}
