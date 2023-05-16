import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const ALLOWED_HAND_ITEM_IDS: number[] = [ 2, 5, 7, 8, 9, 10, 27 ];

export const WiredActionBotGiveHandItemView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    const [ isOpen, setIsOpen ] = useState(false);

    function handleSelectClick() {
        setIsOpen(!isOpen);
    }

    function handleSelectBlur() {
        setIsOpen(false);
    }

    const onHandItemIdChange = (id: number) => {
            setHandItemId(id);
    }

    const save = () =>
    {
        setStringParam(botName);
        setIntParams([ handItemId ]);
    }

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text gfbold>{ LocalizeText('wiredfurni.params.handitem') }</Text>
                <div className={`customSelect ${isOpen ? 'active' : ''}`} onClick={handleSelectClick} onBlur={handleSelectBlur} tabIndex={0}>
                        <div className="selectButton">{LocalizeText(`handitem${ handItemId }`)}</div>
                        <div className="options">
                            {ALLOWED_HAND_ITEM_IDS.map(value => (
                                <div
                                    key={ value }
                                    value={ value }
                                    className={`option ${isOpen && value === handItemId ? 'selected' : ''}`}
                                    onClick={() => onHandItemIdChange(value)}>
                                    { LocalizeText(`handitem${ value }`) }
                                </div>
                            ))}
                        </div>
                    </div>
                <hr className="m-0 color-dark" />
            </Column>
        </WiredActionBaseView>
    );
}
