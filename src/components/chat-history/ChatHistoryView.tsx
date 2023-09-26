import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { AddEventLinkTracker, ChatEntryType, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Column, Flex, InfiniteScroll, Text } from '../../common';
import { useChatHistory } from '../../hooks';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ searchText, setSearchText ] = useState<string>('');
    const [ searchStartTime, setSearchStartTime ] = useState<string | null>(null);
    const [ searchEndTime, setSearchEndTime ] = useState<string | null>(null);
    const [ selectedRoomId, setSelectedRoomId ] = useState<number | null>(null);
    const { chatHistory = [] } = useChatHistory();
    const [ hiddenRooms, setHiddenRooms ] = useState<Record<number, boolean>>({}); // Keep track of rooms that are hidden
    const elementRef = useRef<HTMLDivElement>(null);

    const handleRowClick = (entry: IChatEntry) => {
        if (entry.type === ChatEntryType.TYPE_ROOM_INFO) {
            const key = `${entry.roomId}-${entry.id}`;
            setHiddenRooms(prev => ({
                ...prev,
                [key]: !prev[key]
            }));
        }
    };

    const clearFilters = () => {
        setSearchText('');
        setSearchStartTime(null);
        setSearchEndTime(null);
    }

    const filteredChatHistory = useMemo(() => {
        const parser = new DOMParser();

        let filtered = chatHistory.filter(entry => {
            let message = entry.message ? parser.parseFromString(`<!doctype html><body>${entry.message}`, 'text/html').body.textContent : '';
            let name = entry.name ? parser.parseFromString(`<!doctype html><body>${entry.name}`, 'text/html').body.textContent : '';

            return ((entry.type === ChatEntryType.TYPE_ROOM_INFO) ||
                (searchText.length === 0 ||
                    (message && message.toLowerCase().includes(searchText.toLowerCase())) ||
                    (name && name.toLowerCase().includes(searchText.toLowerCase())))
                ) &&
                (searchStartTime === null || entry.timestamp >= searchStartTime) &&
                (searchEndTime === null || entry.timestamp <= searchEndTime)
        });

        if (Object.keys(hiddenRooms).length > 0) {
            let currentKey = null;
            filtered = filtered.filter((entry) => {
                if (entry.type === ChatEntryType.TYPE_ROOM_INFO) {
                    currentKey = `${entry.roomId}-${entry.id}`;
                    return true;
                }
                return !hiddenRooms[currentKey];
            });
        }

        return filtered;
    }, [chatHistory, searchText, searchStartTime, searchEndTime, hiddenRooms]);


    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible) elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }, [ isVisible ]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'chat-history/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if(!isVisible) return null;

    return (
        <>
            { isVisible &&
            <Flex gap={ 2 } className="nitro-chat-history">
                <Column className="chat-history-content h-100">
                    <Column innerRef={ elementRef } className="h-100" gap={ 1 }>
                        <Column className="w-100 px-1" gap={ 1 }>
                            <Flex>
                                <Column className="w-100" gap={ 1 }>
                                    <Text small>Start tid</Text>
                                    <input type="time" className="form-control form-control-sm" value={ searchStartTime || '' } onChange={ event => setSearchStartTime(event.target.value) } />
                                </Column>
                                <Column className="w-100" gap={ 1 }>
                                    <Text small>Slut tid</Text>
                                    <input type="time" className="form-control form-control-sm" value={ searchEndTime || '' } onChange={ event => setSearchEndTime(event.target.value) } />
                                </Column>
                            </Flex>
                            <Flex>
                                <input type="text" className="form-control form-control-sm w-100" placeholder={ LocalizeText('generic.search') } value={ searchText } onChange={ event => setSearchText(event.target.value) } />
                                <button className="btn btn-chat" onClick={clearFilters}>Ryd Filtre</button>
                            </Flex>
                        </Column>
                        <hr className="m-0 color-chat" />
                        <InfiniteScroll rows={ filteredChatHistory } scrollToBottom={ true } rowRender={ row =>
                        {
                            return (
                                <Flex onClick={() => handleRowClick(row)} alignItems="center" className="chat-history-padding" gap={ 2 }>
                                    <Text variant="muted">{ row.timestamp }</Text>
                                    { (row.type === ChatEntryType.TYPE_CHAT) &&
                                <div className="bubble-container room-chatlog" style={ { position: 'relative' } }>
                                    { (row.style === 0) &&
                                    <div className="user-container-bg" style={ { backgroundColor: row.color } } /> }
                                    <div className={ `chat-bubble bubble-${ row.style } type-${ row.chatType }` } style={ { maxWidth: '100%' } }>
                                        <div className="user-container">
                                            { row.imageUrl && (row.imageUrl.length > 0) &&
                                <div className="user-image" style={ { backgroundImage: `url(${ row.imageUrl })` } } /> }
                                        </div>
                                        <div className="chat-content">
                                            <b className="username mr-1" dangerouslySetInnerHTML={ { __html: `${ row.name }: ` } } />
                                            <span className="message" dangerouslySetInnerHTML={ { __html: `${ row.message }` } } />
                                        </div>
                                    </div>
                                </div> }
                                    { (row.type === ChatEntryType.TYPE_ROOM_INFO) &&
                                        <>
                                            <i className="icon icon-small-room" />
                                            <Text textBreak wrap grow>{ row.name }</Text>
                                            { hiddenRooms[`${row.roomId}-${row.id}`]
                                                ? <FaCaretDown className="fa-icon" />
                                                : <FaCaretUp className="fa-icon" />
                                            }
                                        </>
                                    }
                                </Flex>
                            )
                        } } />
                    </Column>
                </Column>
                <Flex className="chat-toggle" onClick={ event => setIsVisible(false) } />
            </Flex>
            }
        </>
    );
}
