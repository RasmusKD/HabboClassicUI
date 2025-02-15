import { FC, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Column, ColumnProps, Flex, Text } from '../..';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';
import { useFriends } from '../../../hooks';

export interface NitroCardAccordionSetView2Props extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
}

export const NitroCardAccordionSetView2: FC<NitroCardAccordionSetView2Props> = props =>
{
    const { headerText = '', isExpanded = false, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();
    const { acceptingAllRequests } = useFriends();

    const onClick = () =>
    {
        closeAll();

        setIsOpen(prevValue => !prevValue);
    }

    const onClose = useCallback(() => setIsOpen(false), []);

    const hasTriggered = useRef(false);

    useEffect(() => {
        if (acceptingAllRequests && !hasTriggered.current) {
            onClick();
            hasTriggered.current = true;
        }
    }, [acceptingAllRequests, onClick]);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ 'nitro-card-accordion-set' ];

        if(isOpen) newClassNames.push('active', 'friends-height', 'friends-bottom-padding');

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
                <div className="friend-header-text d-inline">{ headerText }</div>
                { isOpen && <FaCaretUp className="fa-icon" /> }
                { !isOpen && <FaCaretDown className="fa-icon" /> }
            </Flex>
            { isOpen &&
                <Column fullHeight overflow="auto" gap={ 0 } className="nitro-card-accordion-set-content p-1">
                    { children }
                </Column> }
        </Column>
    );
}
