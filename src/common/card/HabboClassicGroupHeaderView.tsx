import { FC, useMemo } from 'react';
import { Column, Flex, FlexProps } from '..';

export const HabboClassicGroupHeaderView: FC<FlexProps> = props =>
{
    const { justifyContent = 'center', classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'groups-background-color', 'p-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Column classNames={ getClassNames } gap={ 1 } { ...rest } />;
}
