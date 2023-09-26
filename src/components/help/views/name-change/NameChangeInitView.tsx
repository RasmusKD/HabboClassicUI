import { CheckUserNameMessageComposer, CheckUserNameResultMessageEvent, ChangeUserNameMessageComposer, UserNameChangeMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../api';
import { useMessageEvent } from '../../../../hooks';
import { NameChangeLayoutViewProps } from './NameChangeView.types';
import { Button, Column, Flex, LayoutCurrencyIconBig, Text } from '../../../../common';
const AVAILABLE: number = 0;
const TOO_SHORT: number = 2;
const TOO_LONG: number = 3;
const NOT_VALID: number = 4;
const TAKEN_WITH_SUGGESTIONS: number = 5;
const DISABLED: number = 6;

export const NameChangeInitView:FC<NameChangeLayoutViewProps> = props =>
{
    const { onAction = null } = props;
    const [ newUsername, setNewUsername ] = useState<string>('');
    const [ canProceed, setCanProceed ] = useState<boolean>(false);
    const [ isChecking, setIsChecking ] = useState<boolean>(false);
    const [ isConfirming, setIsConfirming ] = useState<boolean>(false);  // new state variable
    const [ errorCode, setErrorCode ] = useState<string>(null);
    const [ suggestions, setSuggestions ] = useState<string[]>([]);

    const check = () =>
    {
        if(newUsername === '') return;

        setCanProceed(false);
        setSuggestions([]);
        setErrorCode(null);
        setIsChecking(true);

        SendMessageComposer(new CheckUserNameMessageComposer(newUsername));
    }

    const handleUsernameChange = (username: string) =>
    {
        setCanProceed(false);
        setSuggestions([]);
        setErrorCode(null);
        setNewUsername(username);
    }

    const confirm = () =>
    {
        if(isConfirming) return;  // check if isConfirming is true instead

        setIsConfirming(true);  // set isConfirming to true
        SendMessageComposer(new ChangeUserNameMessageComposer(newUsername));
    }

    useMessageEvent<UserNameChangeMessageEvent>(UserNameChangeMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        if(parser.webId !== GetSessionDataManager().userId) return;

        setIsConfirming(false);  // reset isConfirming
        onAction('close');
    });

    useMessageEvent<CheckUserNameResultMessageEvent>(CheckUserNameResultMessageEvent, event =>
    {
        setIsChecking(false);

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.resultCode)
        {
            case AVAILABLE:
                setCanProceed(true);
                break;
            case TOO_SHORT:
                setErrorCode('short');
                break;
            case TOO_LONG:
                setErrorCode('long');
                break;
            case NOT_VALID:
                setErrorCode('invalid');
                break;
            case TAKEN_WITH_SUGGESTIONS:
                setSuggestions(parser.nameSuggestions);
                setErrorCode('taken');
                break;
            case DISABLED:
                setErrorCode('change_not_allowed');
        }
    });
    return (
        <div className="d-flex flex-column gap-2 h-100">
            <div className="fw-bold d-flex align-items-center justify-content-center h-100 w-100">{ LocalizeText('tutorial.name_change.current', [ 'name' ], [ GetSessionDataManager().userName ]) }</div>
            <div>{ LocalizeText('tutorial.name_change.info.select') }</div>
            <Flex alignItems="center" gap={ 2 }>
                <input spellCheck="false" type="text" className="form-control form-control-sm" value={ newUsername } onChange={ event => handleUsernameChange(event.target.value) } />
                <button className="btn btn-primary" disabled={ newUsername === '' || isChecking } onClick={ check }>{ LocalizeText('tutorial.name_change.check') }</button>
            </Flex>
            { !errorCode && !canProceed &&
                <div className="camera-purchase-bg p-2 text-center">{ LocalizeText('help.tutorial.name.info') }</div> }
            { errorCode &&
                <div className="bg-lightdanger rounded p-2 text-center text-white">{ LocalizeText(`help.tutorial.name.${ errorCode }`, [ 'name' ], [ newUsername ]) }</div> }
            { canProceed &&
                <div className="bg-lightsuccess rounded p-2 text-center text-white">{ LocalizeText('help.tutorial.name.available', [ 'name' ], [ newUsername ]) }</div> }
            { suggestions.length > 0 &&
                <div className="d-flex flex-column gap-2">
                    { suggestions.map((suggestion, index) => <div key={ index } className="col camera-purchase-bg rounded p-1 cursor-pointer" onClick={ () => handleUsernameChange(suggestion) }>{ suggestion }</div>) }
                </div> }
            <Flex justifyContent="between" alignItems="center" className="camera-purchase-bg p-2">
                <Column gap={ 1 }>
                    <Text bold>
                        { LocalizeText('habboclassic.dk.name.purchase.header') }
                    </Text>
                        <Flex gap={ 1 }>
                            <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</Text>
                                <Flex className="camera-price-align" gap={ 1 }>
                                    <Text bold>50</Text>
                                    <LayoutCurrencyIconBig type={ -1 } />
                                </Flex>
                        </Flex>
                </Column>
                <Flex alignSelf="end">
                    <Button className="btn btn-success-thin w-100" disabled={ !canProceed || isChecking || isConfirming } onClick={ confirm  }> { LocalizeText('tutorial.name_change.pick') } </Button>
                </Flex>
            </Flex>
        </div>
    );
}
