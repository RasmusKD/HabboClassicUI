import { NitroPoint } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { Base, Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpacesWidgetView } from '../widgets/CatalogSpacesWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, roomPreviewer = null } = useCatalog();

    useEffect(() =>
    {
        roomPreviewer.updatePreviewObjectBoundingRectangle(new NitroPoint());
    }, [ roomPreviewer ]);

    return (
    <div className="h-default-spcaes">
        <Column center={ !currentOffer } size={ 5 } overflow="hidden">
            { currentOffer &&
                <>
                    <Base position="relative" overflow="hidden">
                        <CatalogViewProductWidgetView />
                        <CatalogTotalPriceWidget className="credits-default-layout credits-bg bottom-1 end-1" justifyContent="end" alignItems="end" />
                        <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                    </Base>
                </> }
        </Column>
        <Column className="h-itemgrid-spaces" size={ 7 } overflow="hidden">
            <CatalogSpacesWidgetView />
        </Column>
            { currentOffer &&
                <>
                    <Flex gap={ 2 } className="purchase-buttons align-items-end mt-2">
                        <CatalogPurchaseWidgetView />
                    </Flex>
                </> }
    </div>
    );
}
