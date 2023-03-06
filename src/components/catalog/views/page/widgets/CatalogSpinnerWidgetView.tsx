import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { CalculateDiscount, LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

const MIN_VALUE: number = 1;
const MAX_VALUE: number = 100;

export const CatalogSpinnerWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    const updateQuantity = (value: number) =>
    {
        if(isNaN(value)) value = 1;

        value = Math.max(value, MIN_VALUE);
        value = Math.min(value, MAX_VALUE);

        if(value === quantity) return;

        const totalDiscount = CalculateDiscount(value, currentOffer?.priceInCredits, currentOffer?.priceInActivityPoints);

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.quantity = value;
            newValue.discount = totalDiscount.total_price_discount;
            newValue.discountPoints = totalDiscount.total_points_discount;
            newValue.amountFree = totalDiscount.total_amount_free_serie;
            newValue.isDiscount = totalDiscount.isDiscounting;

            return newValue;
        });
    }

    if(!currentOffer || !currentOffer.bundlePurchaseAllowed) return null;

    return (
        <>
            <Text className="quantity-text" small>{ LocalizeText('catalog.bundlewidget.spinner.select.amount') }</Text>
            <Flex alignItems="center" gap={ 1 }>
                <input type="number" className="form-control form-control-sm quantity-input quantity-input-left" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber) } />
                <Text className="price-text" small>{ LocalizeText('catalog.bundlewidget.price') }</Text>
            </Flex>
        </>
    );
}
