import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, ColumnProps, Flex, Text } from '../..';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';

export interface NitroCardAccordionSetView3Props extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
}

export const NitroCardAccordionSetView3: FC<NitroCardAccordionSetView3Props> = props =>
{
    const { headerText = '', isExpanded = false, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();

    const onClick = () =>
    {
        closeAll();

        setIsOpen(prevValue => !prevValue);
    }

    const onClose = useCallback(() => setIsOpen(false), []);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ 'nitro-card-accordion-set' ];

        if(isOpen) newClassNames.push('active', 'friends-height', 'search-bottom-padding');

        if(classNames && classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isOpen, classNames ]);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    useEffect(() =>
    {
        const closeFunction = onClose;

        setClosers(prevValue =>
        {
            const newClosers = [ ...prevValue ];

            newClosers.push(closeFunction);

            return newClosers;
        });

        return () =>
        {
            setClosers(prevValue =>
            {
                const newClosers = [ ...prevValue ];

                const index = newClosers.indexOf(closeFunction);

                if(index >= 0) newClosers.splice(index, 1);

                return newClosers;
            });
        }
    }, [ onClose, setClosers ]);

    return (
        <Column classNames={ getClassNames } gap={ gap } { ...rest }>
            <Flex pointer justifyContent="between" className="nitro-card-accordion-set-header px-2 py-1" onClick={ onClick }>
                <div style={{color: '#fff'}} className="d-inline">{ headerText }</div>
                <FontAwesomeIcon icon={ isOpen ? 'caret-up' : 'caret-down' } />
            </Flex>
            { isOpen &&
                <Column fullHeight overflow="auto" gap={ 0 } className="nitro-card-accordion-set-content2 p-1">
                    { children }
                </Column> }
        </Column>
    );
}
