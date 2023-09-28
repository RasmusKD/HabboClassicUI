import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionToggleFurniStateNewView: FC<{}> = props =>
{
    const [ toggleNext, setToggleNext ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
        {
            setIntParams([ toggleNext ]);
        }

        useEffect(() =>
        {
            setToggleNext(trigger.intData[0]);
        }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } hasSpecialInput={ true } save={ save }>
            <Column className='wired-align' gap={ 1 }>
                <hr className="m-0 mt-1 color-dark" />
                <Text gfbold>{ LocalizeText('wiredfurni.params.toggletype_selection') }</Text>
                <Column gap={ 2 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="toggleNext" id="toggleNext0" checked={ (toggleNext === 0) } onChange={ event => setToggleNext(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.toggletype.0') }</Text>
                </Flex>
                <Flex className="mb-1" alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="toggleNext" id="toggleNext1" checked={ (toggleNext === 1) } onChange={ event => setToggleNext(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.toggletype.1') }</Text>
                </Flex>
                </Column>
            </Column>
        </WiredActionBaseView>
    );
}
