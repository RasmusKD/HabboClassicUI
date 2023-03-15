import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveScoreView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ points, time ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setPoints(trigger.intData[0]);
            setTime(trigger.intData[1]);
        }
        else
        {
            setPoints(1);
            setTime(1);
        }
    }, [ trigger ]);

    const handleNext = () => {
        setPoints(points + 1);
    }

    const handlePrev = () => {
        setPoints(points - 1);
    }

    const handleNext2 = () => {
        setTime(time + 1);
    }

    const handlePrev2 = () => {
        setTime(time - 1);
    }

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
                <hr className="m-0 color-dark" />
                <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.setpoints', [ 'points' ], [ points.toString() ]) }</Text>
                <Flex className='mb-1 wired-slider-buttons'>
                    <Button disabled={ ((points === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                        <i className="icon button-prev"/>
                    </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 100 }
                    value={ points }
                    onChange={ event => setPoints(event) } />
                    <Button disabled={ ((points === 100)) } className="notification-buttons help-button-size" onClick={ handleNext }>
                        <i className="icon button-next"/>
                    </Button>
                </Flex>
                <hr className="m-0 color-dark" />
                <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.settimesingame', [ 'times' ], [ time.toString() ]) }</Text>
                <Flex className='mb-1 wired-slider-buttons'>
                    <Button disabled={ ((time === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev2 }>
                        <i className="icon button-prev"/>
                    </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 10 }
                    value={ time }
                    onChange={ event => setTime(event) } />
                    <Button disabled={ ((time === 10)) }className="notification-buttons help-button-size" onClick={ handleNext2 }>
                        <i className="icon button-next"/>
                    </Button>
                </Flex>
                <hr className="m-0 color-dark" />
        </WiredActionBaseView>
    );
}
