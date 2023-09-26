import { WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import ReactSlider from 'react-slider';
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredBaseView } from '../WiredBaseView';
import { WiredFurniSelectorView } from '../WiredFurniSelectorView';

export interface WiredActionBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
    hasDelay?: boolean;
}

export const WiredActionBaseView: FC<PropsWithChildren<WiredActionBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null, hasDelay = true } = props;
    const { trigger = null, actionDelay = 0, setActionDelay = null } = useWired();
     const sliderRef = useRef();

         useEffect(() =>
         {
             setActionDelay((trigger as WiredActionDefinition).delayInPulses);
         }, [ trigger, setActionDelay ]);

         useEffect(() => {
             const handleKeyDown = (event) => {
                 if (event.key === 'ArrowRight' && actionDelay < 600) {
                     setActionDelay(actionDelay + 1);
                 }
                 if (event.key === 'ArrowLeft' && actionDelay > 0) {
                     setActionDelay(actionDelay - 1);
                 }
             }

             window.addEventListener('keydown', handleKeyDown);

             return () => window.removeEventListener('keydown', handleKeyDown);
         }, [actionDelay, setActionDelay]);

    useEffect(() =>
    {
        setActionDelay((trigger as WiredActionDefinition).delayInPulses);
    }, [ trigger, setActionDelay ]);

    const handleNext = () => {
        setActionDelay(actionDelay + 1);
    }

    const handlePrev = () => {
        setActionDelay(actionDelay - 1);
    }
    return (
        <WiredBaseView wiredType="action" requiresFurni={ requiresFurni } save={ save } hasSpecialInput={ hasSpecialInput } hasDelay={ hasDelay }>
            { children }
                { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>  <hr className="m-0 color-dark" />
                        <WiredFurniSelectorView />
                        { hasDelay &&
                        <hr className="m-0 color-dark" />}
                    </> }
                { hasDelay &&
                <>
                <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.delay', [ 'seconds' ], [ GetWiredTimeLocale(actionDelay) ]) }</Text>
                <Flex className='wired-slider-buttons wired-help-bottom'>
                    <Button disabled={ ((actionDelay === 0)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                        <i className="icon button-prev"/>
                    </Button>
                    <ReactSlider
                        ref={sliderRef}
                        className={ 'wired-slider' }
                        min={ 0 }
                        max={ 600 }
                        value={ actionDelay }
                        onChange={ event => setActionDelay(event) } />
                    <Button disabled={ ((actionDelay === 600)) }className="notification-buttons help-button-size" onClick={ handleNext }>
                        <i className="icon button-next"/>
                    </Button>
                </Flex></>}
        </WiredBaseView>
    );
}
