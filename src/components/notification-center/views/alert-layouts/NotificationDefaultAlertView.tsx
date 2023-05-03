import { FC, useState } from 'react';
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

            console.log('Message:', message);
            console.log('Match:', match);
            console.log('Username:', username);
            console.log('UserData:', userData);

            return userData;
        });
    }

    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT);
    const getUser = item.messages.map( message => message.split('- ')[1] )[0];
    const userData = roomSession.userDataManager.getUserDataByName(getUser?.replace(/(<([^>]+)>)/ig, ''));
    const userData2 = getUserDataByNameFromMessage(item.messages);
    return (
        <LayoutNotificationAlertView className='no-resize' title={ title } onClose={ onClose } { ...rest } type={ hasFrank ? NotificationAlertType.DEFAULT : item.alertType }>
            <Flex fullHeight overflow="auto" gap={ hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0 }>
                { (hasFrank && !item.imageUrl && userData) && <Column center className="notification-avatar-container" style={{ height: imageHeight ? imageHeight + 'px' : 'auto' }}><LayoutAvatarImageView className='notification-cropped-position' cropTransparency={ true } figure={ userData.figure } direction={ 2 } onImageLoad={height => setImageHeight(height)} /></Column> }
                { item.imageUrl && !imageFailed && userData2 && <Column center className="notification-avatar-container" style={{ height: imageHeight ? imageHeight + 'px' : 'auto' }}><LayoutAvatarImageView className='notification-cropped-position' cropTransparency={ true } figure={ userData2[0].figure } direction={ 2 } onImageLoad={height => setImageHeight(height)} /></Column> }
                <Base classNames="notification-text overflow-y-auto d-flex flex-column w-100">
                    { (item.messages.length > 0) && item.messages.map((message, index) =>
                    {
                        const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                        return <Text small key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />;
                    }) }
                </Base>
            </Flex>
            { item.clickUrl && (item.clickUrl.length > 0) && (item.imageUrl && !imageFailed) && <>
                <hr className="my-2 w-100" />
                <Button onClick={ visitUrl } className="align-self-center px-3 btn-thicker">{ LocalizeText(item.clickUrlText) }</Button>
            </> }
            { (!item.imageUrl || (item.imageUrl && imageFailed)) && <>
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