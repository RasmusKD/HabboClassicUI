import { FC, useMemo } from 'react';
import { NotificationAlertType } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroCardViewProps } from '../card';

export interface LayoutNotificationAlertViewProps extends NitroCardViewProps
{
    title?: string;
    type?: string;
    onClose: () => void;
}

export const LayoutNotificationAlertView: FC<LayoutNotificationAlertViewProps> = props =>
{
    const { title = '', onClose = null, classNames = [], children = null, type = NotificationAlertType.DEFAULT, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-alert' ];

        newClassNames.push('nitro-alert-' + type);

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, type ]);

    const contentClassName = useMemo(() => {
        return type === 'alert' ? 'text-black notification-padding' : 'text-black';
    }, [type]);

    return (
        <NitroCardView classNames={ getClassNames } theme="primary" { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ onClose } />
            <NitroCardContentView grow justifyContent="between" overflow="hidden" className={ contentClassName } gap={ 0 }>
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
}
