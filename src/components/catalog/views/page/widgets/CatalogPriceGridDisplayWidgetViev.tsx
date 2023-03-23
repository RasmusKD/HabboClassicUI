import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IPurchasableOffer } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
interface CatalogPriceGridDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
    separator?: boolean;
}

export const CatalogPriceGridDisplayWidgetView: FC<CatalogPriceGridDisplayWidgetViewProps> = props =>
{
    const { offer = null, separator = false } = props;
    const { purchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    if(!offer) return null;

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <Flex alignItems="center" justifyContent="end" gap={ 1 } className="grid-price-view">
                    <Text bold>{ (offer.priceInCredits) }</Text>
                    <i className="icon icon-small-coin" />
                </Flex> }
            { separator && (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                <FaPlus className="fa-icon" /> }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="center" justifyContent="end" gap={ 1 } className="grid-price-view">
                    <Text bold>{ (offer.priceInActivityPoints) }</Text>
                    { (offer.activityPointType === 5) &&
                    <i className="icon icon-small-diamond" /> }
                    { (offer.activityPointType === 0) &&
                    <i className="icon icon-small-pixel" /> }
                </Flex> }
        </>
    );
}
