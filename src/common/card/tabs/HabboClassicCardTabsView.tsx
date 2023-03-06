import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../..';

interface HabboClassicCardTabsProps extends FlexProps
{
    subClassName?: string;
}
export const HabboClassicCardTabsView: FC<HabboClassicCardTabsProps> = props =>
{
    const { justifyContent = 'center', gap = 1, classNames = [], children = null,subClassName = '', ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'habboclassic-camera-tabs', 'pt-1', 'position-relative' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex classNames={ getClassNames } { ...rest }>
            <ul className={ 'nav nav-tabs2' + subClassName }>
                { children }
            </ul>
        </Flex>
    );
}
