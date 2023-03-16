import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionActorIsWearingEffectView: FC<{}> = props =>
{
    const [ effect, setEffect ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ effect ]);

    useEffect(() =>
    {
        setEffect((trigger?.stringData !== '') ? parseInt(trigger?.stringData!) : 0);
    }, [ trigger ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column className='wired-help-bottom' gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.tooltip.effectid') }</Text>
                <input type="number" className="form-control wired-form" value={ effect } onChange={ event => setEffect(parseInt(event.target.value)) } />
            </Column>
        </WiredConditionBaseView>
    );
}
