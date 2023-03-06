import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { IPurchasableOffer } from '../../../../../api';
import { Flex, LayoutCurrencyIconBig, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogPriceDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
    separator?: boolean;
}

export const CatalogPriceDisplayWidgetView: FC<CatalogPriceDisplayWidgetViewProps> = props =>
{
    const { offer = null, separator = false } = props;
    const { purchaseOptions = null } = useCatalog();
    const { quantity = 1, discount = 0, discountPoints = 0, isDiscount = false } = purchaseOptions;

    if(!offer) return null;

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <Flex alignItems="center" gap={ 1 }>
                    <Text bold style={ { textDecoration: isDiscount ? 'line-through' : '', textDecorationColor: isDiscount ? 'red' : '', textDecorationStyle: isDiscount ? 'solid' : undefined, opacity: isDiscount ? 0.5 : 1 } }>
                        { (offer.priceInCredits * quantity) }
                    </Text>
                    { (isDiscount) &&
                        <Text bold>{ discount }</Text>
                    }
                    <LayoutCurrencyIconBig type={ -1 } />
                </Flex> }
            { (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                <Text bold>+</Text> }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="center" gap={ 1 }>
                    <Text bold style={ { textDecoration: isDiscount ? 'line-through' : '', textDecorationColor: isDiscount ? 'red' : '', textDecorationStyle: isDiscount ? 'solid' : undefined, opacity: isDiscount ? 0.5 : 1 } }>
                        { (offer.priceInActivityPoints * quantity) }
                    </Text>
                    { (isDiscount) &&
                        <Text bold>{ discountPoints }</Text>
                    }
                    <LayoutCurrencyIconBig type={ offer.activityPointType } />
                </Flex> }
        </>
    );
}
