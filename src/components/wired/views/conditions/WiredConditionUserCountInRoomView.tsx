import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionUserCountInRoomView: FC<{}> = props =>
{
    const [ min, setMin ] = useState(1);
    const [ max, setMax ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ min, max ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMin(trigger.intData[0]);
            setMax(trigger.intData[1]);
        }
        else
        {
            setMin(1);
            setMax(1);
        }
    }, [ trigger ]);

    const handleNext1 = () => {
        setMin(min + 1);
    }

    const handlePrev1 = () => {
        setMin(min - 1);
    }

    const handleNext2 = () => {
        setMax(max + 1);
    }

    const handlePrev2 = () => {
        setMax(max - 1);
    }

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <hr className="m-0 color-dark" />
            <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.usercountmin', [ 'value' ], [ min.toString() ]) }</Text>
            <Flex className='mb-1 wired-slider-buttons '>
                <Button disabled={ ((min === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev1 }>
                    <i className="icon button-prev"/>
                </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 50 }
                    value={ min }
                    onChange={ event => setMin(event) } />
                <Button disabled={ ((min === 50)) } className="notification-buttons help-button-size" onClick={ handleNext1 }>
                    <i className="icon button-next"/>
                </Button>
            </Flex>
            <hr className="m-0 color-dark" />
            <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.usercountmax', [ 'value' ], [ max.toString() ]) }</Text>
            <Flex className='wired-help-bottom wired-slider-buttons '>
                <Button disabled={ ((max === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev2 }>
                    <i className="icon button-prev"/>
                </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 50 }
                    value={ max }
                    onChange={ event => setMax(event) } />
                <Button disabled={ ((max === 50)) } className="notification-buttons help-button-size" onClick={ handleNext2 }>
                    <i className="icon button-next"/>
                </Button>
            </Flex>
        </WiredConditionBaseView>
    );
}
