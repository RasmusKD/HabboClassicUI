import { FigureUpdateEvent, RoomUnitChatStyleComposer, UserInfoDataParser, UserInfoEvent, UserSettingsEvent } from '@nitrots/nitro-renderer';
import { FC, useState, useRef, useEffect } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationAlertType, OpenUrl } from '../../../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, LayoutNotificationAlertView, LayoutNotificationAlertViewProps, Text } from '../../../../common';
import { useRoom } from '../../../../hooks';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), onClose = null, ...rest } = props;
    const [ imageFailed, setImageFailed ] = useState<boolean>(false)
    const { roomSession = null } = useRoom();
    const [imageHeight, setImageHeight] = useState<number>(null);
    const [searchValue, setSearchValue] = useState('');
    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const renderSearchField = () => (
            <input spellCheck="false" placeholder="Søg..." className="command-search form-control form-control6" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} style={{ marginBottom: '6px' }} />
    );
     const filteredMessages = item.messages.filter((message) =>
            message.toLowerCase().includes(searchValue.toLowerCase())
        );
    const visitUrl = () =>
    {
        OpenUrl(item.clickUrl);

        onClose();
    }
    const getUserDataByNameFromMessage = (messages: string[]) => {
        return messages.map(message => {
            const regex = /<b>(.*?)<\/b>/;
            const match = message.match(regex);
            const username = match ? match[1] : '';
            const userData = roomSession.userDataManager.getUserDataByName(username.trim());

            return userData;
        });
    }

   const MOTDText = ({ line, style, setChatValue }) => {
     const regex = /<b>:(.*?)<\/b>/;
     const match = line.match(regex);
     const command = match ? match[1] : '';

     const localizedText = command ? LocalizeText(`${command}.info`) : '';

     const [showInfo, setShowInfo] = useState(false);
     const [position, setPosition] = useState({ x: 0, y: 0 });
     const [isClicked, setIsClicked] = useState(false);

     const infoImageRef = useRef(null);

     const handleMouseEnter = () => {
       const draggableWindow = document.getElementById("Commands");
       const windowRect = draggableWindow.getBoundingClientRect();
       const imageRect = infoImageRef.current.getBoundingClientRect();
    setPosition({
      x: imageRect.left - windowRect.left + imageRect.width + 30,
      y: imageRect.top - windowRect.top + 15,
    });
    setShowInfo(true);
     };

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
          }, 1500); // Set the duration you want the "copied" message to be shown
          const event = new CustomEvent("motdTextClick", { detail: command });
          window.dispatchEvent(event);
        };


    const cursorStyle = localizedText ? { cursor: 'pointer', minHeight: '30px' } : { cursor: 'default', minHeight: '30px' };
    const buttonClickedStyle = isClicked ? { boxShadow: 'inset 2px 2px 2px rgba(0, 0, 0, 0.5)' } : {};
    const displayedText = copiedToChat ? 'Kopieret til chatten!' : line;
     return (
       <Flex justifyContent="between" alignItems="center" style={{ ...style, ...cursorStyle, ...buttonClickedStyle }} onClick={handleDivClick} >
             <Text className="command-text-position" small dangerouslySetInnerHTML={{ __html: displayedText }} />
             {localizedText && (
               <div ref={infoImageRef} className="info-image" onMouseEnter={handleMouseEnter} onMouseLeave={() => setShowInfo(false)} >
                 <div className={`p-2 info-information${showInfo ? '' : ' d-none'}`} style={{ left: position.x, top: position.y, transform: 'translateY(-50%)' }} >
                   <div className="info-desc">{localizedText}</div>
                 </div>
               </div>
             )}
           </Flex>
         );
       };

    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT);
    const getUser = item.messages.map( message => message.split('- ')[1] )[0];
    const userData = roomSession.userDataManager.getUserDataByName(getUser?.replace(/(<([^>]+)>)/ig, ''));
    const userData2 = getUserDataByNameFromMessage(item.messages);
    return (
        <LayoutNotificationAlertView className='no-resize' title={ title } onClose={ onClose } { ...rest } type={ hasFrank ? NotificationAlertType.DEFAULT : item.alertType }>
            {item.alertType === NotificationAlertType.MOTD && renderSearchField()}
            <Flex fullHeight overflow="auto" gap={ hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0 }>
                { (hasFrank && !item.imageUrl && userData) && <Column center className="notification-avatar-container" style={{ height: imageHeight ? imageHeight + 'px' : 'auto' }}><LayoutAvatarImageView className='notification-cropped-position' cropTransparency={ true } figure={ userData.figure } direction={ 2 } onImageLoad={height => setImageHeight(height)} /></Column> }
                { item.imageUrl && !imageFailed && userData2 && <Column center className="notification-avatar-container" style={{ height: imageHeight ? imageHeight + 'px' : 'auto' }}><LayoutAvatarImageView className='notification-cropped-position' cropTransparency={ true } figure={ userData2[0].figure } direction={ 2 } onImageLoad={height => setImageHeight(height)} /></Column> }
                <Base classNames="notification-text overflow-y-auto d-flex flex-column w-100">
                    {(item.messages.length > 0) &&
                        item.messages.map((message, index) => {
                            const lines = message.split(/\r\n|\r|\n/);
                            const filteredLines = lines.filter((line, index) => !(index === lines.length - 1 && line.trim() === ""));

                            // Filter the MOTDText components based on the search value
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
                </Base>
            </Flex>
            { item.clickUrl && (item.clickUrl.length > 0) && (item.imageUrl && !imageFailed) && <>
                <hr className="my-2 w-100" />
                <Button onClick={ visitUrl } className="align-self-center px-3 btn-thicker">{ LocalizeText(item.clickUrlText) }</Button>
            </> }
            { (!item.imageUrl || (item.imageUrl && imageFailed)) && !NotificationAlertType.MOTD && <>
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