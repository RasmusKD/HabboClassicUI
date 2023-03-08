import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggeExecuteOnceView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ time ]);

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const handleNext = () => {
        setTime(time + 1);
    }

    const handlePrev = () => {
        setTime(time - 1);
    }

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.settime', [ 'seconds' ], [ GetWiredTimeLocale(time) ]) }</Text>
                <Flex className='wired-slider-buttons wired-help-bottom'>
                    <Button disabled={ ((time === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                        <i className="icon button-prev"/>
                    </Button>
                    <ReactSlider
                        className={ 'wired-slider' }
                        min={ 1 }
                        max={ 1200 }
                        value={ time }
                        onChange={ event => setTime(event) } />
                    <Button disabled={ ((time === 1200)) }className="notification-buttons help-button-size" onClick={ handleNext }>
                        <i className="icon button-next"/>
                    </Button>
                </Flex>
            </Column>
        </WiredTriggerBaseView>
    );
}
