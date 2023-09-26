import { FC, useEffect } from 'react';
import { Base, Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGuildBadgeWidgetView } from '../widgets/CatalogGuildBadgeWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, setCurrentOffer = null, purchaseOptions = null, currentPage = null } = useCatalog();

        useEffect(() =>
        {
            if(!currentPage || !currentPage.offers.length) return;

            setCurrentOffer(currentPage.offers[0]);
        }, [ currentPage, setCurrentOffer ]);

    return (
        <div className="h-default">
            <Column className="position-relative catalog-default-image" center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img draggable="false" alt="" src={ page.localization.getImage(1) } /> }
                        <Text className="py-5" center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogGuildBadgeWidgetView position="absolute" className="top-1 end-1" />
                            <CatalogTotalPriceWidget className="credits-default-layout credits-bg bottom-1 end-1" justifyContent="end" alignItems="end" />
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                            <Flex justifyContent="between">

                            </Flex>
                        </Column>
                    </> }
            </Column>
            <Column className="grid-bg h-itemgrid-groups p-2" size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            <Base>
                <CatalogGuildSelectorWidgetView />
            </Base>
            <Flex gap={ 2 } className="purchase-buttons align-items-end mt-1">
                <CatalogPurchaseWidgetView />
            </Flex>
        </div>
    );
}
