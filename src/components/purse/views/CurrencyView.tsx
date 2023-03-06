import { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeFormattedNumber, LocalizeShortNumber } from '../../../api';
import { Flex, Text } from '../../../common';

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const element = useMemo(() =>
    {
        return (
            <Flex fullWidth pointer gap={ 1 } className="nitro-purse-button">
                <Text fullWidth className="mt-auto mb-auto nitro-purse-amount" bold truncate textEnd variant="white" grow>{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</Text>
            </Flex>);
    }, [ amount, short ]);

    if(!short) return element;
    
    return (
        <OverlayTrigger
            placement="left"
            overlay={
                <Tooltip id={ `tooltip-${ type }` }>
                    { LocalizeFormattedNumber(amount) }
                </Tooltip>
            }>
            { element }
        </OverlayTrigger>
    );
}
