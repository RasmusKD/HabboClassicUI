import { WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { GetWiredTimeLocale, LocalizeText, WiredFurniType, CreateLinkEvent } from '../../../../api';
import { Column, Text } from '../../../../common';
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

    return (
        <WiredBaseView wiredType="action" requiresFurni={ requiresFurni } save={ save } hasSpecialInput={ hasSpecialInput }>
            { children }
            { !!children && <hr className="m-0 bg-dark" /> }
                { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <WiredFurniSelectorView />
                        <hr className="m-0 bg-dark" />
                    </> }
            <Column>
                <Text gfbold>{ LocalizeText('wiredfurni.params.delay', [ 'seconds' ], [ GetWiredTimeLocale(actionDelay) ]) }</Text>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 0 }
                    max={ 20 }
                    value={ actionDelay }
                    onChange={ event => setActionDelay(event) } />

                <Text underline pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ event => CreateLinkEvent('habboUI/open/wiredhelp') }>
                      { LocalizeText('wiredfurni.help') }
                </Text>
            </Column>
        </WiredBaseView>
    );
}
