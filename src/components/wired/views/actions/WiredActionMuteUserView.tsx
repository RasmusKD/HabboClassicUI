import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetConfiguration, LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionMuteUserView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(-1);
    const [ message, setMessage ] = useState('');
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    const save = () =>
    {
        setIntParams([ time ]);
        setStringParam(message);
    }

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setMessage(trigger.stringData);
    }, [ trigger ]);

    const handleNext = () => {
        setTime(time + 1);
    }

    const handlePrev = () => {
        setTime(time - 1);
    }

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <hr className="m-0 color-dark" />
            <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.length.minutes', [ 'minutes' ], [ time.toString() ]) }</Text>
            <Flex className='mb-1 wired-slider-buttons'>
                <Button disabled={ ((time === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                    <i className="icon button-prev"/>
                </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 10 }
                    value={ time }
                    onChange={ event => setTime(event) } />
                <Button disabled={ ((time === 10)) } className="notification-buttons help-button-size" onClick={ handleNext }>
                    <i className="icon button-next"/>
                </Button>
            </Flex>
            <hr className="m-0 color-dark" />
            <Column className='mb-1' gap={ 1 }>
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" value={ message } onChange={ event => setMessage(event.target.value) } maxLength={ GetConfiguration<number>('wired.action.mute.user.max.length', 100) } />
            </Column>
            <hr className="m-0 color-dark" />
        </WiredActionBaseView>
    );
}
