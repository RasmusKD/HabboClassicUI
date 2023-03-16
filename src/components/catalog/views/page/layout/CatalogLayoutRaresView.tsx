import { FC, useEffect } from 'react';
import { ProductTypeEnum, LocalizeText } from '../../../../../api';
import { Base, Column, Flex, Grid, LayoutImage, LayoutFurniImageView, LayoutCatalogueDiscountView, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseRareView } from '../widgets/CatalogPurchaseRareView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutRaresView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, setCurrentOffer = null, purchaseOptions = null, currentPage = null } = useCatalog();

        useEffect(() =>
        {
            if(!currentPage || !currentPage.offers.length) return;

            setCurrentOffer(currentPage.offers[0]);
        }, [ currentPage, setCurrentOffer ]);

    return (
        <Column>
            <Text gfnb dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            <Column className="position-relative catalog-rare-image" center size={ 5 } overflow="hidden">
                    { currentPage.offers && currentPage.offers.length > 0 && currentPage.offers.map(offer => <Base key={ offer.localizationId }>
                    <LayoutFurniImageView productType={ offer.product.productType } productClassId={ offer.product.productClassId } extraData={ offer.product.extraParam } />
                    </Base>) }
            </Column>
            {currentOffer && (
                <Column gap={ 0 }>
                    <Text center className="catalog-rare-text">{ currentOffer.localizationName }</Text>
                    <Text center gfnb>{ currentOffer.localizationDescription }</Text>
                </Column> ) }
            <Flex gap={ 1 } className="quanity-container" justifyContent="center">
                 <CatalogTotalPriceWidget />
            </Flex>
            <Flex gap={ 2 } className="purchase-buttons2 align-self-center mt-1">
                <CatalogPurchaseRareView />
            </Flex>
            </Column>
    );
}
