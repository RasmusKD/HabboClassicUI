import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, WiredFurniType, WIRED_STRING_DELIMETER } from '../../../../api';
import { Button, Column, Flex, LayoutAvatarImageView, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const DEFAULT_FIGURE: string = 'hd-180-1.ch-210-66.lg-270-82.sh-290-81';

export const WiredActionBotChangeFigureView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ figure, setFigure ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam((botName + WIRED_STRING_DELIMETER + figure));

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);

        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setFigure(data[1].length > 0 ? data[1] : DEFAULT_FIGURE);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Flex alignItems="center">
                <LayoutAvatarImageView figure={ figure } direction={ 2 } />
                <Button className="wired-help-bottom margin-top-auto volter-button" onClick={ event => setFigure(GetSessionDataManager().figure) }>{ LocalizeText('wiredfurni.params.capture.figure') }</Button>
            </Flex>
        </WiredActionBaseView>
    );
}
