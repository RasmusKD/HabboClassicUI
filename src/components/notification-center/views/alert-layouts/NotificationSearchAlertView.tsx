import { FC, useEffect, useState } from 'react';
import { LocalizeText, NotificationAlertItem, OpenUrl } from '../../../../api';
import { AutoGrid, Button, Column, Flex, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationSeachAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), onClose = null, ...rest } = props;

    const [searchValue, setSearchValue] = useState(() => {
        return sessionStorage.getItem("NotificationSearchValue") || "";
    });
    const [ results, setResults ] = useState<string[]>([]);

    const visitUrl = () =>
    {
        OpenUrl(item.clickUrl);

        onClose();
    }

    const updateSearchValue = (value: string) =>
    {
        let res = JSON.parse(item.messages[0]);

        setResults(res.filter((val: string) => val.includes(value)));
        setSearchValue(value);
    }

    useEffect(() => {
        sessionStorage.setItem("NotificationSearchValue", searchValue);
    }, [searchValue]);

    useEffect(() =>
    {
        setResults(JSON.parse(item.messages[0]));
    }, [ item ]);

    const isAction = (item.clickUrl && item.clickUrl.startsWith('event:'));

    return (
        <LayoutNotificationAlertView className='no-resize' title={ title } onClose={ onClose } { ...rest }>
            <Flex fullWidth alignItems="center" position="relative">
                <input spellCheck="false" type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => updateSearchValue(event.target.value) } />
            </Flex>
            <Column fullHeight className="py-1" overflow="hidden">
                <AutoGrid gap={ 1 } columnCount={ 1 }>
                    { results && results.map((n, index) =>
                    {
                        return <span key={ index }>{ n }</span>
                    }) }
                </AutoGrid>
            </Column>
            <hr className="my-2"/>
            <Column alignItems="center" center gap={ 1 }>
                { !isAction && !item.clickUrl &&
                    <Button className="btn-thicker" onClick={ onClose }>{ LocalizeText('generic.close') }</Button> }
                { item.clickUrl && (item.clickUrl.length > 0) &&
                    <Button className="btn-thicker" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
            </Column>
        </LayoutNotificationAlertView>
    );
}
