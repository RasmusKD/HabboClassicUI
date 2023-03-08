import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggeScoreAchievedView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ points ]);

    useEffect(() =>
    {
        setPoints((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const handleNext = () => {
        setPoints(points + 1);
    }

    const handlePrev = () => {
        setPoints(points - 1);
    }

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.setscore', [ 'points' ], [ points.toString() ]) }</Text>
                <Flex className='wired-slider-buttons wired-help-bottom'>
                    <Button disabled={ ((points === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                        <i className="icon button-prev"/>
                    </Button>
                    <ReactSlider
                        className={ 'wired-slider' }
                        min={ 1 }
                        max={ 1000 }
                        value={ points }
                        onChange={ event => setPoints(event) } />
                    <Button disabled={ ((points === 1000)) } className="notification-buttons help-button-size" onClick={ handleNext }>
                        <i className="icon button-next"/>
                    </Button>
                </Flex>
            </Column>
        </WiredTriggerBaseView>
    );
}
