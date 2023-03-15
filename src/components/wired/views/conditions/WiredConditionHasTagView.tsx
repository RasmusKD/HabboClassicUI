import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionHasTagView: FC<{}> = props =>
{
    const [ badge, setBadge ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(badge);

    useEffect(() =>
    {
        setBadge(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column className='wired-help-bottom' gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.tag') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" value={ badge } onChange={ event => setBadge(event.target.value) } />
            </Column>
        </WiredConditionBaseView>
    );
}
