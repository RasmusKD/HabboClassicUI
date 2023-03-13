import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarSaysSomethingView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const [ triggererAvatar, setTriggererAvatar ] = useState(-1);
    const [ keywordMatchMode, setKeywordMatchMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(message);
        setIntParams([ triggererAvatar, keywordMatchMode ]);
    }

        useEffect(() =>
        {
            setMessage(trigger.stringData);
            setTriggererAvatar(trigger.intData[0]);
            setKeywordMatchMode(trigger.intData[1]);
        }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.whatissaid') }</Text>
                <input spellCheck="false" type="text" className="form-control wired-form" value={ message } onChange={ event => setMessage(event.target.value) } />
            </Column>
            <Column className='wired-align' gap={ 1 }>
                <hr className="m-0 mt-1 color-dark" />
                <Text gfbold>{ LocalizeText('wiredfurni.params.chattriggertype') }</Text>
                <Column gap={ 2 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="keywordMatchMode" id="keywordMatchMode0" checked={ (keywordMatchMode === 0) } onChange={ event => setKeywordMatchMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.chatcontains') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="keywordMatchMode" id="keywordMatchMode1" checked={ (keywordMatchMode === 1) } onChange={ event => setKeywordMatchMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.exactmatch') }</Text>
                </Flex>
                </Column>
            </Column>
            <Column className='wired-align' gap={ 1 }>
                <hr className="m-0 mt-1 color-dark" />
                <Text gfbold>{ LocalizeText('wiredfurni.params.picktriggerer') }</Text>
                <Column gap={ 2 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="triggererAvatar" id="triggererAvatar0" checked={ (triggererAvatar === 0) } onChange={ event => setTriggererAvatar(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.anyavatar') }</Text>
                </Flex>
                <Flex className="mb-1" alignItems="center" gap={ 1 }>
                    <input className="flash-wired-form-check-radio-input" type="radio" name="triggererAvatar" id="triggererAvatar1" checked={ (triggererAvatar === 1) } onChange={ event => setTriggererAvatar(1) } />
                    <Text>{ GetSessionDataManager().userName }</Text>
                </Flex>
                </Column>
            </Column>
        </WiredTriggerBaseView>
    );
}
