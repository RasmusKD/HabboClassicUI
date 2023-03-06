import { FC } from 'react';
import { NotificationAlertType, NotificationConfirmItem } from '../../../../api';
import { Button, Flex, LayoutNotificationAlertView, LayoutNotificationAlertViewProps, Text } from '../../../../common';

export interface NotificationDefaultConfirmViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationConfirmItem;
}

export const NotificationDefaultConfirmView: FC<NotificationDefaultConfirmViewProps> = props =>
{
    const { item = null, onClose = null, ...rest } = props;
    const { message = null, onConfirm = null, onCancel = null, confirmText = null, cancelText = null, title = null } = item;

    const confirm = () =>
    {
        if(onConfirm) onConfirm();

        onClose();
    }

    const cancel = () =>
    {
        if(onCancel) onCancel();

        onClose();
    }

    return (
        <LayoutNotificationAlertView className='no-resize' title={ title } onClose={ onClose } { ...rest } type={ NotificationAlertType.ALERT }>
            <Flex grow>
                <Text small>{ message }</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                <Text pointer small underline onClick={ cancel }>{ cancelText }</Text>
                <Button className="btn-thicker" onClick={ confirm }>{ confirmText }</Button>
            </Flex>
        </LayoutNotificationAlertView>
    );
}
