import { CSSProperties, FC, useMemo } from 'react';
import { GetConfiguration } from '../../api';
import { Base, BaseProps } from '../Base';

export interface CurrencyIconBigProps extends BaseProps<HTMLDivElement>
{
    type: number | string;
}

export const LayoutCurrencyIconBig: FC<CurrencyIconBigProps> = props =>
{
    const { type = '', classNames = [], style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-currency-icon-big' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const urlString = useMemo(() =>
    {
        let url = GetConfiguration<string>('currency.asset.icon.big.url', '');

        url = url.replace('%type%', type.toString());

        return `url(${ url })`;
    }, [ type ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        newStyle.backgroundImage = urlString;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ style, urlString ]);

    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />
}
