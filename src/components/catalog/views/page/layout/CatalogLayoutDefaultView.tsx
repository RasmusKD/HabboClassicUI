import { FC } from 'react';
import { Offer, ProductTypeEnum, LocalizeText } from '../../../../../api';
import { Base, Column, Flex, Grid, LayoutImage, LayoutCatalogueDiscountView, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, purchaseOptions = null, currentPage = null } = useCatalog();

    return (
        <div className="h-default">
            <Column className="position-relative catalog-default-image" center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) &&
                            <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                                { (currentOffer.product.productType !== ProductTypeEnum.BADGE) &&
                                    <>
                            <CatalogViewProductWidgetView />
                            <CatalogLimitedItemWidgetView fullWidth position="absolute" className="top-1" />
                            <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded top-1 end-1" />
                            </> }
                            { (currentOffer.product.productType === ProductTypeEnum.BADGE) && <CatalogAddOnBadgeWidgetView className="scale-2" /> }
                        </Base>
                        { currentOffer.pricingModel != Offer.PRICING_MODEL_BUNDLE &&
                        <Column grow gap={ 1 }>
                            <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                            <Text italics variant="white" className="item-desc" grow truncate>{ currentOffer.localizationDescription }</Text>
                        </Column>}
                        { currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE &&
                        <Column grow gap={ 1 }>
                            <Text bold variant="black" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                            <Text italics variant="black" className="item-desc" grow truncate>{ currentOffer.localizationDescription }</Text>
                        </Column>}
                    </> }
            </Column>
            <Column className="grid-bg h-itemgrid p-2" size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            <Flex gap={ 1 } className="quanity-container mt-2">
                <CatalogSpinnerWidgetView />
                 { (purchaseOptions?.isDiscount) &&
                      <LayoutCatalogueDiscountView amountFree={ purchaseOptions?.amountFree } />
                 }
                 <CatalogTotalPriceWidget className="credits-default2-layout" alignItems="end" />
            </Flex>
            <Flex gap={ 2 } className="purchase-buttons align-items-end mt-1">
                <CatalogPurchaseWidgetView />
            </Flex>
        </div>
    );
}
