import { FC, PropsWithChildren } from 'react';
import { WiredFurniType, CreateLinkEvent, LocalizeText } from '../../../../api';
import { WiredBaseView } from '../WiredBaseView';
import { WiredFurniSelectorView } from '../WiredFurniSelectorView';
import { Column, Text } from '../../../../common';

export interface WiredConditionBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredConditionBaseView: FC<PropsWithChildren<WiredConditionBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;

    const onSave = () => (save && save());

    return (
        <WiredBaseView wiredType="condition" requiresFurni={ requiresFurni } hasSpecialInput={ hasSpecialInput } save={ onSave }>
            { children }
            { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <WiredFurniSelectorView />
                        <hr className="m-0 bg-dark" />
                    </> }
                <Column>
                    <Text underline pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ event => CreateLinkEvent('habboUI/open/wiredhelp') }>
                        { LocalizeText('wiredfurni.help') }
                    </Text>
                </Column>
        </WiredBaseView>
    );
}
