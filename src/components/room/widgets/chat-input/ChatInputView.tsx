import { HabboClubLevelEnum, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChatMessageTypeEnum, GetClubMemberLevel, GetConfiguration, GetSessionDataManager, LocalizeText, RoomWidgetUpdateChatInputContentEvent } from '../../../../api';
import { Base, classNames, Text, useFilteredInput } from '../../../../common';
import { useChatInputWidget, useRoom, useSessionInfo, useUiEvent } from '../../../../hooks';
import { ChatInputStyleSelectorView } from './ChatInputStyleSelectorView';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const emojis =  [ '😀', '😆', '😅', '🤣', '😂',  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗',  '😚', '😋', '😛', '😝', '😜', '🤪', '🤔', '🤨', '😐', '😶', '🤭', '🥳', '😗', '🤗','😎'];

export const ChatInputView: FC<{}> = props =>
{
    const [ chatValue, setChatValue ] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messagesHistory, setMessagesHistory] = useState<string[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number|null>(null);
    const { chatStyleId = 0, updateChatStyleId = null } = useSessionInfo();
    const { selectedUsername = '', floodBlocked = false, floodBlockedSeconds = 0, setIsTyping = null, setIsIdle = null, sendChat = null } = useChatInputWidget();
    const { roomSession = null } = useRoom();
    const inputRef = useRef<HTMLInputElement>();
    const chatModeIdWhisper = useMemo(() => LocalizeText('widgets.chatinput.mode.whisper'), []);
    const chatModeIdShout = useMemo(() => LocalizeText('widgets.chatinput.mode.shout'), []);
    const chatModeIdSpeak = useMemo(() => LocalizeText('widgets.chatinput.mode.speak'), []);
    const maxChatLength = useMemo(() => GetConfiguration<number>('chat.input.maxlength', 100), []);

    function EmojiButton({ showEmojiPicker }) {
      const [emojiIcon, setEmojiIcon] = useState(localStorage.getItem('emojiIcon') || '😀');

      useEffect(() => {
        localStorage.setItem('emojiIcon', emojiIcon);
      }, [emojiIcon]);

      const handleMouseOver = useCallback(() => {
              if (!showEmojiPicker) {
                  setEmojiIcon(getRandomEmoji(emojiIcon));
              }
          }, [emojiIcon, showEmojiPicker]);

      const getRandomEmoji = useCallback((currentEmojiIcon) => {
        let newEmojiIcon = currentEmojiIcon;
        while (newEmojiIcon === currentEmojiIcon) {
          const randomIndex = Math.floor(Math.random() * emojis.length);
          newEmojiIcon = emojis[randomIndex];
        }
        return newEmojiIcon;
      }, []);

    return (
        <Base pointer className={`emoji-image${showEmojiPicker ? ' active' : ''}`} onMouseOver={handleMouseOver} >
            {emojiIcon || ''}
        </Base>
        );
    }

    function handleEmojiSelect(emoji) {
        if (chatValue.length + emoji.native.length <= maxChatLength) {
            if (inputRef.current) {
                const start = inputRef.current.selectionStart || 0;
                const end = inputRef.current.selectionEnd || 0;
                const chatValueStart = chatValue.slice(0, start);
                const chatValueEnd = chatValue.slice(end, chatValue.length);
                const updatedChatValue = chatValueStart + emoji.native + chatValueEnd;
                inputRef.current.value = updatedChatValue;
                const newCursorPosition = start + emoji.native.length;
                updateChatInput(updatedChatValue);
                inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
                inputRef.current.focus();
            }
        }
    }

    const anotherInputHasFocus = useCallback(() =>
    {
        const activeElement = document.activeElement;

        if(!activeElement) return false;

        if(inputRef && (inputRef.current === activeElement)) return false;

        if(!(activeElement instanceof HTMLInputElement) && !(activeElement instanceof HTMLTextAreaElement)) return false;

        return true;
    }, [ inputRef ]);

    const setInputFocus = useCallback(() =>
    {
        inputRef.current.focus();

        inputRef.current.setSelectionRange((inputRef.current.value.length * 2), (inputRef.current.value.length * 2));
    }, [ inputRef ]);

    const checkSpecialKeywordForInput = useCallback(() =>
    {
        setChatValue(prevValue =>
        {
            if((prevValue !== chatModeIdWhisper) || !selectedUsername.length) return prevValue;

            return (`${ prevValue } ${ selectedUsername }`);
        });
    }, [ selectedUsername, chatModeIdWhisper ]);

    const sendChatValue = useCallback((value: string, shiftKey: boolean = false) => {
      if (!value || value === '') return;

      let chatType = shiftKey ? ChatMessageTypeEnum.CHAT_SHOUT : ChatMessageTypeEnum.CHAT_DEFAULT;
      let text = value;

      const parts = text.split(' ');

      let recipientName = '';
      let append = '';

      switch (parts[0]) {
        case chatModeIdWhisper:
          chatType = ChatMessageTypeEnum.CHAT_WHISPER;
          recipientName = parts[1];
          append = chatModeIdWhisper + ' ' + recipientName + ' ';

          parts.shift();
          parts.shift();
          break;
        case chatModeIdShout:
          chatType = ChatMessageTypeEnum.CHAT_SHOUT;

          parts.shift();
          break;
        case chatModeIdSpeak:
          chatType = ChatMessageTypeEnum.CHAT_DEFAULT;

          parts.shift();
          break;
      }

      text = parts.join(' ');

      setIsTyping(false);
      setIsIdle(false);

      if (text.length <= maxChatLength) {
        if (!/%CC%/g.test(encodeURIComponent(text))) {
          sendChat(text, chatType, recipientName, chatStyleId);
        }
      }

      setChatValue(append);
      setTimeout(() => {
        inputRef.current.value = append;
      }, 0);
      if (value !== messagesHistory[messagesHistory.length - 1]) {
              setMessagesHistory(prev => [...prev, value]);
          }
          setCurrentHistoryIndex(null);
    }, [chatModeIdWhisper, chatModeIdShout, chatModeIdSpeak, maxChatLength, chatStyleId, setIsTyping, setIsIdle, sendChat]);

    const handleInputChange = useFilteredInput(chatValue, setChatValue);

    const updateChatInput = useCallback((value: string) => {
      if (!value || !value.length) {
        setIsTyping(false);
      } else {
        setIsTyping(true);
        setIsIdle(true);
      }

      handleInputChange({ target: { value } } as ChangeEvent<HTMLInputElement>);
    }, [setIsTyping, setIsIdle, handleInputChange]);

    const onKeyDownEvent = useCallback((event: KeyboardEvent) =>
    {
        if(floodBlocked || !inputRef.current || anotherInputHasFocus()) return;

        if(document.activeElement !== inputRef.current) setInputFocus();

        const value = (event.target as HTMLInputElement).value;

        switch(event.key)
        {
            case ' ':
            case 'Space':
                checkSpecialKeywordForInput();
                return;
            case 'ArrowUp':
                if (GetSessionDataManager().arrowKeys !== 1) return;
                event.preventDefault();
                if (currentHistoryIndex === null && messagesHistory.length > 0) {
                    setCurrentHistoryIndex(messagesHistory.length - 1);
                    setChatValue(messagesHistory[messagesHistory.length - 1]);
                } else if (currentHistoryIndex && currentHistoryIndex > 0) {
                    setCurrentHistoryIndex(currentIndex => currentIndex! - 1);
                    setChatValue(messagesHistory[currentHistoryIndex! - 1]);
                }
                return;
            case 'ArrowDown':
                if (GetSessionDataManager().arrowKeys !== 1) return;
                if (currentHistoryIndex !== null && currentHistoryIndex < messagesHistory.length - 1) {
                    setCurrentHistoryIndex(currentIndex => currentIndex! + 1);
                    setChatValue(messagesHistory[currentHistoryIndex! + 1]);
                } else {
                    setCurrentHistoryIndex(null); // reset to allow user to type a new one
                    setChatValue(''); // clear the chat input
                }
                return;
            case 'NumpadEnter':
            case 'Enter':
                sendChatValue(value, event.shiftKey);
                return;
            case 'Backspace':
                if(value)
                {
                    const parts = value.split(' ');

                    if((parts[0] === chatModeIdWhisper) && (parts.length === 3) && (parts[2] === ''))
                    {
                        setChatValue('');
                    }
                }
                return;
        }

    }, [ floodBlocked, inputRef, chatModeIdWhisper, anotherInputHasFocus, setInputFocus, checkSpecialKeywordForInput, sendChatValue ]);

    useUiEvent<RoomWidgetUpdateChatInputContentEvent>(RoomWidgetUpdateChatInputContentEvent.CHAT_INPUT_CONTENT, event =>
    {
        switch(event.chatMode)
        {
            case RoomWidgetUpdateChatInputContentEvent.WHISPER: {
                setChatValue(`${ chatModeIdWhisper } ${ event.userName } `);
                return;
            }
            case RoomWidgetUpdateChatInputContentEvent.SHOUT:
                return;
        }
    });

    const chatStyleIds = useMemo(() =>
    {
        let styleIds: number[] = [];

        const styles = GetConfiguration<{ styleId: number, minRank: number, isSystemStyle: boolean, isHcOnly: boolean, isAmbassadorOnly: boolean }[]>('chat.styles');

        for(const style of styles)
        {
            if(!style) continue;

            if(style.minRank > 0)
            {
                if(GetSessionDataManager().hasSecurity(style.minRank)) styleIds.push(style.styleId);

                continue;
            }

            if(style.isSystemStyle)
            {
                if(GetSessionDataManager().hasSecurity(RoomControllerLevel.MODERATOR))
                {
                    styleIds.push(style.styleId);

                    continue;
                }
            }

            if(GetConfiguration<number[]>('chat.styles.disabled').indexOf(style.styleId) >= 0) continue;

            if(style.isHcOnly && (GetClubMemberLevel() >= HabboClubLevelEnum.CLUB))
            {
                styleIds.push(style.styleId);

                continue;
            }

            if(style.isAmbassadorOnly && GetSessionDataManager().isAmbassador)
            {
                styleIds.push(style.styleId);

                continue;
            }

            if(!style.isHcOnly && !style.isAmbassadorOnly) styleIds.push(style.styleId);
        }

        return styleIds;
    }, []);

    useEffect(() => {
        const handleMotdTextClick = (event: Event) => {
          const customEvent = event as CustomEvent;
          const command = customEvent.detail;
          setChatValue(prevValue => `:${command} `);
          setInputFocus()
        };

        window.addEventListener("motdTextClick", handleMotdTextClick);

        return () => {
          window.removeEventListener("motdTextClick", handleMotdTextClick);
        };
      }, []);

    useEffect(() =>
    {
        document.body.addEventListener('keydown', onKeyDownEvent);

        return () =>
        {
            document.body.removeEventListener('keydown', onKeyDownEvent);
        }
    }, [ onKeyDownEvent ]);

    useEffect(() =>
    {
        if(!inputRef.current) return;

        inputRef.current.parentElement.dataset.value = chatValue;
    }, [ chatValue ]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const emojiPickerContainer = document.querySelector('.emoji-mart');
        const emojiSelector = document.querySelector('.emoji-selector');
        if (
          emojiPickerContainer &&
          emojiSelector &&
          !emojiPickerContainer.contains(event.target as Node) &&
          !emojiSelector.contains(event.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    if(!roomSession || roomSession.isSpectator) return null;

    return (
        createPortal(
            <div className="nitro-chat-input-container">
                <ChatInputStyleSelectorView chatStyleId={ chatStyleId } chatStyleIds={ chatStyleIds } selectChatStyleId={ updateChatStyleId } />
                <Base className="emoji-selector" pointer onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <EmojiButton showEmojiPicker={showEmojiPicker} />
                </Base>
                <div className="input-sizer align-items-center">
                    { !floodBlocked &&
                    <input ref={ inputRef } spellCheck="false" type="text" className="chat-input chat-input-size" placeholder={ LocalizeText('widgets.chatinput.default') } value={ chatValue } maxLength={ maxChatLength } onChange={ event => updateChatInput(event.target.value) } onMouseDown={ event => setInputFocus() } /> }
                    { floodBlocked &&
                    <Text variant="danger">{ LocalizeText('chat.input.alert.flood', [ 'time' ], [ floodBlockedSeconds.toString() ]) } </Text> }
                </div>
                <div className="emoji-mart">{showEmojiPicker && (<Picker set="native" onEmojiSelect={handleEmojiSelect}/> )}</div>
            </div>, document.getElementById('toolbar-chat-input-container'))

    );
}
