import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionPointsNoGameView: FC<{}> = props =>
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
                <Text gfbold>{ LocalizeText('wiredfurni.params.points') }</Text>
                <input spellCheck="false" type="text" className="form-control form-control-sm" value={ message } onChange={ event => setMessage(event.target.value) } maxLength={ 100 } />
            </Column>
        </WiredActionBaseView>
    );
}
