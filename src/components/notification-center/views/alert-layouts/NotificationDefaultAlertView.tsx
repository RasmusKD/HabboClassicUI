import { FC, useState } from 'react';
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

     const visitUrl = () =>
    {
        OpenUrl(item.clickUrl);

        onClose();
    }

    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT);

    return (
        <LayoutNotificationAlertView className='no-resize' title={ title } onClose={ onClose } { ...rest } type={ hasFrank ? NotificationAlertType.DEFAULT : item.alertType }>
            <Flex fullHeight overflow="auto" gap={ hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0 }>
                { item.imageUrl && !imageFailed && <img src={ item.imageUrl } alt={ item.title } onError={ () =>
                {
                    setImageFailed(true)
                } } className="align-self-baseline" /> }
                <Base classNames={ [ 'notification-text overflow-y-auto d-flex flex-column w-100', (item.clickUrl && !hasFrank) ? 'justify-content-center' : '' ] }>
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
