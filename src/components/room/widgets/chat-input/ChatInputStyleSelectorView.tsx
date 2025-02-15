import { FC, MouseEvent, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { Base, Flex, Grid, NitroCardContentView } from '../../../../common';

interface ChatInputStyleSelectorViewProps {
    chatStyleId: number;
    chatStyleIds: number[];
    selectChatStyleId: (styleId: number) => void;
}

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = (props) => 
{
    const { chatStyleId = 0, chatStyleIds = null, selectChatStyleId = null } = props;
    const [ target, setTarget ] = useState<EventTarget & HTMLElement>(null);
    const [ selectorVisible, setSelectorVisible ] = useState(false);

    const selectStyle = (styleId: number) => 
    {
        selectChatStyleId(styleId);
        setSelectorVisible(false);
    };

    const toggleSelector = (event: MouseEvent<HTMLElement>) => 
    {
        let visible = false;

        setSelectorVisible((prevValue) => 
        {
            visible = !prevValue;

            return visible;
        });

        if (visible) setTarget(event.target as EventTarget & HTMLElement);
    };

    useEffect(() => 
    {
        if (selectorVisible) return;

        setTarget(null);
    }, [ selectorVisible ]);

    return (
        <>
            <Base
                pointer
                className="chatstyles-selector cursor-pointer"
                onClick={ toggleSelector }
            />
            <Overlay
                show={ selectorVisible }
                target={ target }
                placement="top"
                rootClose={ true }
                onHide={ () => setSelectorVisible(false) }
            >
                <Popover className="nitro-chat-style-selector-container">
                    <NitroCardContentView overflow="hidden" className="bg-transparent bubble-window image-rendering-pixelated">
                        <Grid gap={ 1 } columnCount={ 3 }>
                            { chatStyleIds && chatStyleIds.length > 0 && chatStyleIds.map((styleId) =>
                            {
                                return (
                                    <Flex center pointer key={ styleId } className="bubble-parent-container" onClick={ (event) => selectStyle(styleId) }>
                                        <Base key={ styleId } className="bubble-container">
                                            <Base className={ `chat-bubble-icon bubble-${ styleId }` }>&nbsp;</Base>
                                        </Base>
                                    </Flex>
                                );
                            }) }
                        </Grid>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
};
