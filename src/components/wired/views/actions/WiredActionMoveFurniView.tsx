import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 4,
        icon: 'ne'
    },
    {
        value: 5,
        icon: 'se'
    },
    {
        value: 6,
        icon: 'sw'
    },
    {
        value: 7,
        icon: 'nw'
    },
    {
        value: 2,
        icon: 'mv-2'
    },
    {
        value: 3,
        icon: 'mv-3'
    },
    {
        value: 1,
        icon: 'mv-1'
    }
];

const rotationOptions: number[] = [ 0, 1, 2, 3 ];

export const WiredActionMoveFurniView: FC<{}> = props =>
{
    const [ movement, setMovement ] = useState(-1);
    const [ rotation, setRotation ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ movement, rotation ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMovement(trigger.intData[0]);
            setRotation(trigger.intData[1]);
        }
        else
        {
            setMovement(-1);
            setRotation(-1);
        }
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } hasSpecialInput={ true } save={ save }>
            <Column className='wired-align' gap={ 1 }>
                <hr className="m-0 color-dark"/>
                <Text gfbold>{ LocalizeText('wiredfurni.params.movefurni') }</Text>
                <Column gap={ 2 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="selectedTeam" id="movement0" checked={ (movement === 0) } onChange={ event => setMovement(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.movefurni.0') }</Text>
                </Flex>
                <Flex className='mb-1 wired-wrap wired-gap'>
                    { directionOptions.map(option =>
                    {
                        return (
                            <Flex alignItems="center" key={ option.value }>
                                <input className="flash-wired-form-check-radio-input" type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                <i className={ `icon icon-${ option.icon }` } />
                            </Flex>
                        )
                    }) }
                    <div className="col" />
                </Flex>
                </Column>
            </Column>
            <Column className='wired-align' gap={ 1 }>
                <hr className="m-0 color-dark"/>
                <Text gfbold>{ LocalizeText('wiredfurni.params.rotatefurni') }</Text>
                <Column className="mb-1" gap={ 2 }>
                { rotationOptions.map(option =>
                {
                    return (
                        <Flex alignItems="center" key={ option } gap={ 1 }>
                            <input className="flash-wired-form-check-radio-input" type="radio" name="rotation" id={ `rotation${ option }` } checked={ (rotation === option) } onChange={ event => setRotation(option) } />
                            <Flex gap={ 0 }>
                            { [ 1, 2 ].includes(option) && <i className={ `icon icon-rot-${ option }` } /> }
                            <Text>
                                { LocalizeText(`wiredfurni.params.rotatefurni.${ option }`) }
                            </Text>
                            </Flex>
                        </Flex>
                    )
                }) }
                </Column>
            </Column>
        </WiredActionBaseView>
    );
}
