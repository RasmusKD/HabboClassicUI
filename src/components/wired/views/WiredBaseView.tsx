import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { CreateLinkEvent, GetSessionDataManager, LocalizeText, WiredFurniType, WiredSelectionVisualizer } from '../../../api';
import { Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useWired } from '../../../hooks';
import { WiredFurniSelectorView } from './WiredFurniSelectorView';

export interface WiredBaseViewProps
{
    wiredType: string;
    requiresFurni: number;
    hasSpecialInput: boolean;
    save: () => void;
    validate?: () => boolean;
    hasDelay?: boolean;
}

export const WiredBaseView: FC<PropsWithChildren<WiredBaseViewProps>> = props =>
{
    const { wiredType = '', requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, validate = null, children = null, hasSpecialInput = false, hasDelay = true } = props;
    const [ wiredName, setWiredName ] = useState<string>(null);
    const [ wiredDescription, setWiredDescription ] = useState<string>(null);
    const [ needsSave, setNeedsSave ] = useState<boolean>(false);
    const { trigger = null, setTrigger = null, setIntParams = null, setStringParam = null, setFurniIds = null, setAllowsFurni = null, saveWired = null } = useWired();

    const onClose = () => setTrigger(null);

    const onSave = () =>
    {
        if(validate && !validate()) return;

        if(save) save();

        setNeedsSave(true);
    }

    useEffect(() =>
    {
        if(!needsSave) return;

        saveWired();

        setNeedsSave(false);
    }, [ needsSave, saveWired ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            // cleanup on component unmount
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [onClose]);

    useEffect(() =>
    {
        if(!trigger) return;

        const spriteId = (trigger.spriteId || -1);
        const furniData = GetSessionDataManager().getFloorItemData(spriteId);

        if(!furniData)
        {
            setWiredName(('NAME: ' + spriteId));
            setWiredDescription(('NAME: ' + spriteId));
        }
        else
        {
            setWiredName(furniData.name);
            setWiredDescription(furniData.description);
        }

        if(hasSpecialInput)
        {
            setIntParams(trigger.intData);
            setStringParam(trigger.stringData);
        }

        if(requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE)
        {
            setFurniIds(prevValue =>
            {
                if(prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue);

                if(trigger.selectedItems && trigger.selectedItems.length)
                {
                    WiredSelectionVisualizer.applySelectionShaderToFurni(trigger.selectedItems);

                    return trigger.selectedItems;
                }

                return [];
            });
        }
        setAllowsFurni(requiresFurni);
    }, [ trigger, hasSpecialInput, requiresFurni, setIntParams, setStringParam, setFurniIds, setAllowsFurni ]);

    return (
        <NitroCardView uniqueKey="nitro-wired" className="nitro-wired" theme="wired">
            <NitroCardHeaderView headerText={ LocalizeText('wiredfurni.title') } onCloseClick={ onClose } />
            <NitroCardContentView gap={ 1 }className='content-area-wired'>
                <Column className='wired-title-height' gap={ 1 }>
                    <Flex gap={ 1 }>
                        <i className={ `icon icon-wired-${ wiredType }` } />
                        <Text gfbold>{ wiredName }</Text>
                    </Flex>
                </Column>
                { children }
                <Column className='bottom-gap'>
                    <Text underline pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ event => CreateLinkEvent('habboUI/open/wiredhelp') }>
                        { LocalizeText('wiredfurni.help') }
                    </Text>
                    <hr className="m-0 color-dark" />
                    <Flex alignItems="center" gap={ 1 }>
                        <button type="button" className="btn btn-primary notification-buttons w-100" onClick={ onSave }>{ LocalizeText('wiredfurni.ready') }</button>
                        <button type="button" className="btn btn-primary notification-buttons w-100" onClick={ onClose }>{ LocalizeText('cancel') }</button>
                    </Flex>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
