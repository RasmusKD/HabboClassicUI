import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, OpenMessengerChat, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, NitroCardAccordionItemView, NitroCardAccordionSetView3, NitroCardAccordionSetViewProps, Text, UserProfileIconView } from '../../../../common';
import { useFriends, useMessageEvent } from '../../../../hooks';

interface FriendsSearchViewProps extends NitroCardAccordionSetViewProps
{

}

export const FriendsSearchView: FC<{ setIsHovering: any } & FriendsSearchViewProps> = props =>
{
    const { setIsHovering, ...rest } = props;
    const [searchValue, setSearchValue] = useState(() => {
        return sessionStorage.getItem("FriendSearchValue") || "";
    });
    const handleHover = (index, value) => {
        setIsHovering(prevValue => ({ ...prevValue, [index]: value }));
    };
    const [ friendResults, setFriendResults ] = useState<HabboSearchResultData[]>(null);
    const [ otherResults, setOtherResults ] = useState<HabboSearchResultData[]>(null);
    const { canRequestFriend = null, requestFriend = null } = useFriends();

    useMessageEvent<HabboSearchResultEvent>(HabboSearchResultEvent, event =>
    {
        const parser = event.getParser();

        setFriendResults(parser.friends);
        setOtherResults(parser.others);
    });

    useEffect(() => {
        sessionStorage.setItem("FriendSearchValue", searchValue);
    }, [searchValue]);

    useEffect(() =>
    {
        if(!searchValue || !searchValue.length) return;

        const timeout = setTimeout(() =>
        {
            if(!searchValue || !searchValue.length) return;

            SendMessageComposer(new HabboSearchComposer(searchValue));
        }, 500);

        return () => clearTimeout(timeout);
    }, [ searchValue ]);

    return (
        <NitroCardAccordionSetView3 { ...rest }>
            <Column className="h-100">
                <Column gap={ 0 }>
                    { friendResults &&
                    <>
                        { (friendResults.length === 0) &&
                            <Text gfbold className="px-2 py-1 search-tab-color">{ LocalizeText('friendlist.search.nofriendsfound') }</Text> }
                        { (friendResults.length > 0) &&
                            <Column gap={ 0 }>
                                <Text gfbold className="px-2 py-1 search-tab-color">{ LocalizeText('friendlist.search.friendscaption', [ 'cnt' ], [ friendResults.length.toString() ]) }</Text>
                                <Column gap={ 0 }>
                                    { friendResults.sort((a, b) => a.avatarName.localeCompare(b.avatarName)).map(result =>
                                    {
                                        return (
                                            <NitroCardAccordionItemView key={ result.avatarId } justifyContent="between" className="px-2 py-1 search-tab-height search-tab">
                                                <Flex alignItems="center" gap={ 1 }>
                                                    <UserProfileIconView onMouseOver={() => handleHover(4, true)} onMouseOut={() => handleHover(4, false)} userId={ result.avatarId } />
                                                    <div>{ result.avatarName }</div>
                                                </Flex>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    { result.isAvatarOnline &&
                                                    <Base onMouseOver={() => handleHover(5, true)} onMouseOut={() => handleHover(5, false)} className="nitro-friends-spritesheet icon-chat cursor-pointer" onClick={ event => OpenMessengerChat(result.avatarId) } /> }
                                                </Flex>
                                            </NitroCardAccordionItemView>
                                        )
                                    }) }
                                </Column>
                            </Column> }
                    </> }
                    { otherResults &&
                    <>
                        { (otherResults.length === 0) &&
                            <Text gfbold className={`px-2 py-1 ${friendResults.length % 2 === 1 ? 'search-tab-color' : ''}`}>{ LocalizeText('friendlist.search.noothersfound') }</Text> }
                        { (otherResults.length > 0) &&
                            <Column gap={ 0 }>
                                <Text gfbold className={`px-2 py-1 ${friendResults.length % 2 === 1 ? 'search-tab-color' : ''}`}>{ LocalizeText('friendlist.search.otherscaption', [ 'cnt' ], [ otherResults.length.toString() ]) }</Text>
                                <Column gap={ 0 }>
                                    { otherResults.sort((a, b) => a.avatarName.localeCompare(b.avatarName)).map(result =>
                                    {
                                        return (
                                            <NitroCardAccordionItemView key={ result.avatarId } justifyContent="between" className={`px-2 py-1 search-tab-height ${friendResults.length % 2 === 1 ? 'search-tab' : 'search-tab2'}`}>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    <UserProfileIconView onMouseOver={() => handleHover(4, true)} onMouseOut={() => handleHover(4, false)} userId={ result.avatarId } />
                                                    <div>{ result.avatarName }</div>
                                                </Flex>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    { canRequestFriend(result.avatarId) &&
                                                    <Base onMouseOver={() => handleHover(8, true)} onMouseOut={() => handleHover(8, false)} className="nitro-friends-spritesheet icon-add cursor-pointer" onClick={event => { requestFriend(result.avatarId, result.avatarName); handleHover(8, false);}} /> }
                                                </Flex>
                                            </NitroCardAccordionItemView>
                                        )
                                    }) }
                                </Column>
                            </Column> }
                    </> }
                </Column>
                <Column className='search-active-tab'>
                    <input spellCheck="false" type="text" className="w-100 friend-search" placeholder={ LocalizeText('generic.search') } value={ searchValue } maxLength={ 50 } onChange={ event => setSearchValue(event.target.value) } />
                </Column>
            </Column>
        </NitroCardAccordionSetView3>
    );
}
