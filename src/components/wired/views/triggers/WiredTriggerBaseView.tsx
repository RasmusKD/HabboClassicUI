import { FC, PropsWithChildren } from 'react';
import { WiredFurniType, LocalizeText } from '../../../../api';
import { WiredBaseView } from '../WiredBaseView';
import { WiredFurniSelectorView } from '../WiredFurniSelectorView';
import { Text } from '../../../../common';

export interface WiredTriggerBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredTriggerBaseView: FC<PropsWithChildren<WiredTriggerBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;

    const onSave = () => (save && save());

    return (
        <WiredBaseView wiredType="trigger" requiresFurni={ requiresFurni } hasSpecialInput={ hasSpecialInput } save={ onSave }>
            { children }
            { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <hr className="m-0 color-dark" />
                        <WiredFurniSelectorView />
                    </> }
        </WiredBaseView>
    );
}
