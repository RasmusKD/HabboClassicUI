import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotFollowAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ followMode, setFollowMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(botName);
        setIntParams([ followMode ]);
    }

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column className="mb-1" gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Column gap={ 2 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="followMode" id="followMode1" checked={ (followMode === 1) } onChange={ event => setFollowMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.start.following') }</Text>
                </Flex>
                <Flex className="mb-1" alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="followMode" id="followMode2" checked={ (followMode === 0) } onChange={ event => setFollowMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.stop.following') }</Text>
                </Flex>
                </Column>
                <hr className="m-0 color-dark" />
            </Column>
        </WiredActionBaseView>
    );
}
