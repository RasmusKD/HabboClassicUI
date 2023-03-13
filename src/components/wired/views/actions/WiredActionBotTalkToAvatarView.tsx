import { FC, useEffect, useState } from 'react';
import { GetConfiguration, LocalizeText, WiredFurniType, WIRED_STRING_DELIMETER } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotTalkToAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ talkMode, setTalkMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(botName + WIRED_STRING_DELIMETER + message);
        setIntParams([ talkMode ]);
    }

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);

        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setMessage(data[1].length > 0 ? data[1] : '');

        setTalkMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column className="mb-1" gap={ 1 }>
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" maxLength={ GetConfiguration<number>('wired.action.bot.talk.max.length', 64) } value={ message } onChange={ event => setMessage(event.target.value) } />
            </Column>
            <Column className='wired-align' gap={ 1 }>
                <Column gap={ 2 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="talkMode" id="talkMode1" checked={ (talkMode === 0) } onChange={ event => setTalkMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.talk') }</Text>
                </Flex>
                <Flex className="mb-1" alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="talkMode" id="talkMode2" checked={ (talkMode === 1) } onChange={ event => setTalkMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.whisper') }</Text>
                </Flex>
                </Column>
                <hr className="m-0 color-dark" />
            </Column>
        </WiredActionBaseView>
    );
}
