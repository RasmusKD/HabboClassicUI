import { FC, useEffect } from 'react';
import { ProductTypeEnum, LocalizeText } from '../../../../../api';
import { Base, Column, Flex, Grid, LayoutImage, LayoutCatalogueDiscountView, Text } from '../../../../../common';
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
            <Text className="catalog-rare-text" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            <Column className="position-relative catalog-rare-image" center size={ 5 } overflow="hidden">
                { currentOffer &&
                    <>
                        { !!page.localization.getImage(1) &&
                            <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                    </> }
            </Column>
            <Text center className="catalog-rare-text2" dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
            <Flex gap={ 1 } className="quanity-container" justifyContent="center">
                 <CatalogTotalPriceWidget />
            </Flex>
            <Flex gap={ 2 } className="purchase-buttons2 align-self-center mt-1">
                <CatalogPurchaseRareView />
            </Flex>
            </Column>
    );
}
