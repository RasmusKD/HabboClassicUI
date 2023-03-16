import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 0,
        icon: 'ne'
    },
    {
        value: 2,
        icon: 'se'
    },
    {
        value: 4,
        icon: 'sw'
    },
    {
        value: 6,
        icon: 'nw'
    }
];

export const WiredActionMoveFurniToView: FC<{}> = props =>
{
    const [ spacing, setSpacing ] = useState(-1);
    const [ movement, setMovement ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ movement, spacing ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setSpacing(trigger.intData[1]);
            setMovement(trigger.intData[0]);
        }
        else
        {
            setSpacing(-1);
            setMovement(-1);
        }
    }, [ trigger ]);

    const handleNext = () => {
        setSpacing(spacing + 1);
    }

    const handlePrev = () => {
        setSpacing(spacing - 1);
    }

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } hasSpecialInput={ true } save={ save }>
            <hr className="m-0 color-dark" />
            <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.emptytiles', [ 'tiles' ], [ spacing.toString() ]) }</Text>
            <Flex className='mb-1 wired-slider-buttons'>
                <Button disabled={ ((spacing === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                    <i className="icon button-prev"/>
                </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 5 }
                    value={ spacing }
                    onChange={ event => setSpacing(event) } />
                <Button disabled={ ((spacing === 5)) } className="notification-buttons help-button-size" onClick={ handleNext }>
                    <i className="icon button-next"/>
                </Button>
            </Flex>
            <hr className="m-0 color-dark" />
            <Column className='wired-align' gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.startdir') }</Text>
                <Flex className='mb-1 wired-gap'>
                    { directionOptions.map(value =>
                    {
                        return (
                            <Flex key={ value.value } alignItems="center" gap={ 1 }>
                                <input className="flash-wired-form-check-radio-input" type="radio" name="movement" id={ `movement${ value.value }` } checked={ (movement === value.value) } onChange={ event => setMovement(value.value) } />
                                <Text><i className={ `icon icon-${ value.icon }` } /></Text>
                            </Flex>
                        )
                    }) }
                </Flex>
            </Column>
        </WiredActionBaseView>
    );
}
