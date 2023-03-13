import { FC, useEffect, useState } from 'react';
import { GetConfiguration, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionChatView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(message);

    useEffect(() =>
    {
        setMessage(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" value={ message } onChange={ event => setMessage(event.target.value) } maxLength={ GetConfiguration<number>('wired.action.chat.max.length', 100) } />
                <hr className="m-0 color-dark" />
            </Column>
        </WiredActionBaseView>
    );
}
