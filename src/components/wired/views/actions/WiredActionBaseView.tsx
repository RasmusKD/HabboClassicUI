import { WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect } from 'react';
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
}

export const WiredActionBaseView: FC<PropsWithChildren<WiredActionBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;
    const { trigger = null, actionDelay = 0, setActionDelay = null } = useWired();

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
        <WiredBaseView wiredType="action" requiresFurni={ requiresFurni } save={ save } hasSpecialInput={ hasSpecialInput }>
            { children }
                { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>  <hr className="m-0 color-dark" />
                        <WiredFurniSelectorView />
                        <hr className="m-0 color-dark" />
                    </> }
                <Text className='slider-text-margin' gfbold>{ LocalizeText('wiredfurni.params.delay', [ 'seconds' ], [ GetWiredTimeLocale(actionDelay) ]) }</Text>
                <Flex className='wired-slider-buttons wired-help-bottom'>
                    <Button disabled={ ((actionDelay === 0)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                        <i className="icon button-prev"/>
                    </Button>
                    <ReactSlider
                        className={ 'wired-slider' }
                        min={ 0 }
                        max={ 20 }
                        value={ actionDelay }
                        onChange={ event => setActionDelay(event) } />
                    <Button disabled={ ((actionDelay === 20)) }className="notification-buttons help-button-size" onClick={ handleNext }>
                        <i className="icon button-next"/>
                    </Button>
                </Flex>
        </WiredBaseView>
    );
}
