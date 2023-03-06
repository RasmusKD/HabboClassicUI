import { FC, useMemo } from 'react';
import { Base, BaseProps } from '..';

interface LayoutFurniCountViewProps extends BaseProps<HTMLDivElement>
{
    count: number;
}

export const LayoutFurniCountView: FC<LayoutFurniCountViewProps> = props =>
{
    const { count = 0, position = 'absolute', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-furni-count' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base position="absolute" classNames={ getClassNames } { ...rest }>
            { count }
            { children }
        </Base>
    );
}
