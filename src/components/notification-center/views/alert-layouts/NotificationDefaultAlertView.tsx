import { FigureUpdateEvent, RoomUnitChatStyleComposer, UserInfoDataParser, UserInfoEvent, UserSettingsEvent } from '@nitrots/nitro-renderer';
import { FC, useState, useRef, useEffect } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationAlertType, OpenUrl } from '../../../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, LayoutNotificationAlertView, LayoutNotificationAlertViewProps, Text } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), onClose = null, ...rest } = props;
    const [ imageFailed, setImageFailed ] = useState<boolean>(false)
    const [imageHeight, setImageHeight] = useState<number>(null);
    const [searchValue, setSearchValue] = useState('');
    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const renderSearchField = () => (
            <Flex fullWidth gap={ 2 }>
                <input spellCheck="false" type="text" className="form-control form-control-sm" placeholder="Søg..." value={ searchValue } onChange={(e) => setSearchValue(e.target.value)} style={{ marginBottom: '6px' }}/>
            { (!searchValue || !searchValue.length) &&
                <i className="icon icon-pen position-absolute commands-search-button"/> }
            { searchValue && !!searchValue.length &&
                <i className="icon icon-clear position-absolute commands-clear-button" onClick={event => { setSearchValue('') }} /> }
            </Flex>
    );
     const filteredMessages = item.messages.filter((message) =>
            message.toLowerCase().includes(searchValue.toLowerCase())
        );
    const visitUrl = () =>
    {
        OpenUrl(item.clickUrl);

        onClose();
    }

   const MOTDText = ({ line, style, setChatValue }) => {
     const regex = /<b>:(.*?)<\/b>/;
     const match = line.match(regex);
     const infoRegex = /<Info>(.*?)<\/Info>/gs;
     const infoMatch = infoRegex.exec(line);
     const infoText = infoMatch ? infoMatch[1] : '';
     const command = match ? match[1] : '';
     const cleanLine = line.replace(infoRegex, '');

     const localizedText = command ? LocalizeText(`${command}.info`) : '';

     const [showInfo, setShowInfo] = useState(false);
     const [position, setPosition] = useState({ x: 0, y: 0 });
     const [isClicked, setIsClicked] = useState(false);

    const infoImageRef = useRef(null);
    const infoBoxRef = useRef(null);

    useEffect(() => {
        if (showInfo && infoImageRef.current && infoBoxRef.current) {
            const draggableWindow = document.getElementById("Commands");
            const parentElement = draggableWindow.parentNode;
            const windowRect = draggableWindow.getBoundingClientRect();
            const parentRect = parentElement.getBoundingClientRect();
            const imageRect = infoImageRef.current.getBoundingClientRect();
            const infoBoxRect = infoBoxRef.current.getBoundingClientRect();

            setPosition({
                x: windowRect.right - parentRect.left + 3,
                y: (imageRect.top + imageRect.bottom) / 2 - windowRect.top - infoBoxRect.height / 2,
            });
        }
    }, [showInfo]);


      const [copiedToChat, setCopiedToChat] = useState(false);

        const handleDivClick = () => {
          if (!localizedText) {
            return;
          }
          setIsClicked(true);
          setCopiedToChat(true);
          setTimeout(() => {
            setIsClicked(false);
            setCopiedToChat(false);
          }, 1500);
          const event = new CustomEvent("motdTextClick", { detail: command });
          window.dispatchEvent(event);
        };

    const cursorStyle = localizedText ? { cursor: 'pointer', minHeight: '30px' } : { cursor: 'default', minHeight: '30px' };
    const buttonClickedStyle = isClicked ? { boxShadow: 'inset 2px 2px 2px rgba(0, 0, 0, 0.5)' } : {};
    const displayedText = copiedToChat ? 'Kopieret til chatten!' : cleanLine;
     return (
         <Flex justifyContent="between" alignItems="center" style={{ ...style, ...cursorStyle, ...buttonClickedStyle }} onClick={handleDivClick} >
             <Text className="command-text-position" small dangerouslySetInnerHTML={{ __html: displayedText }} />
             {infoText && (
                 <div ref={infoImageRef} className="info-image" onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} >
                     <div ref={infoBoxRef} className={`p-2 info-information${showInfo ? '' : ' d-none'}`} style={{ left: position.x, top: position.y }} >
                         <div className="info-desc">{infoText}</div>
                     </div>
                 </div>
             )}
         </Flex>
     );
     };

    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT);
    const userLookMatch = item.messages[0].match(/<look>(.*?)<\/look>/);
    const userLook = userLookMatch ? userLookMatch[1] : '';
    const cleanedMessages = item.messages.map(message => message.replace(/<look>.*?<\/look>/g, '').trim());
    return (
        <LayoutNotificationAlertView className='no-resize' title={ title } onClose={ onClose } { ...rest } type={ hasFrank ? NotificationAlertType.DEFAULT : item.alertType }>
            {item.alertType === NotificationAlertType.MOTD && renderSearchField()}
            <Flex fullHeight overflow="auto" gap={ hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0 }>
                { userLook && <Column center className="notification-avatar-container" style={{ height: imageHeight ? imageHeight + 'px' : 'auto' }}><LayoutAvatarImageView className='notification-cropped-position' cropTransparency={ true } figure={ userLook  } direction={ 2 } onImageLoad={height => setImageHeight(height)} /></Column> }
                <div className="notification-text overflow-y-auto d-flex flex-column w-100">
                    {(cleanedMessages.length > 0) &&
                            cleanedMessages.map((message, index) => {
                            const lines = message.split(/\r\n|\r|\n/);
                            const filteredLines = lines.filter((line, index) => !(index === lines.length - 1 && line.trim() === ""));

                            const displayedLines = filteredLines.filter((line) =>
                                line.toLowerCase().includes(searchValue.toLowerCase())
                            );

                            return displayedLines.map((line, lineIndex) => {
                              const isEvenLine = lineIndex % 2 === 0;
                              const isMOTD = item.alertType === NotificationAlertType.MOTD;
                              const lineStyle = isMOTD
                                ? !isEvenLine
                                    ? { backgroundColor: '#ddd', minHeight: '30px' }
                                    : { minHeight: '30px' }
                                : {};

                              if (line.startsWith('Dine kommandoer')) {
                                return null;
                              }

                              return line.trim() === "" ? (
                                <br key={`${index}-${lineIndex}`} />
                              ) : isMOTD ? (
                                <MOTDText key={`${index}-${lineIndex}`} line={line} style={lineStyle} />
                              ) : (
                                <Text small key={`${index}-${lineIndex}`} dangerouslySetInnerHTML={{ __html: line }} style={lineStyle} />
                              );
                            });

                        })
                }
                </div>
            </Flex>
            { item.clickUrl && (item.clickUrl.length > 0) && (item.imageUrl && !imageFailed) && <>
                <hr className="my-2 w-100" />
                <Button onClick={ visitUrl } className="align-self-center px-3 btn-thicker">{ LocalizeText(item.clickUrlText) }</Button>
            </> }
           {(!item.imageUrl || (item.imageUrl && imageFailed)) && item.alertType !== NotificationAlertType.MOTD &&  <>
                <Column alignItems="center" center gap={ 0 }>
                    <hr className="my-2 w-100" />
                    { !item.clickUrl &&
                        <Button className="btn-thicker" onClick={ onClose }>{ LocalizeText('generic.close') }</Button> }
                    { item.clickUrl && (item.clickUrl.length > 0) && <Button className="btn-thicker" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
                </Column>
            </> }
        </LayoutNotificationAlertView>
    );

}