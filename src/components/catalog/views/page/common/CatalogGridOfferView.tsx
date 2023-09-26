import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useMemo, useState } from 'react';
import { GetClubMemberLevel, IPurchasableOffer, Offer, ProductTypeEnum } from '../../../../../api';
import { Base, Column, Flex, LayoutAvatarImageView, LayoutGridItemProps } from '../../../../../common';
import { LayoutCatalogGridItem } from '../../../../../common/layout/LayoutCatalogGridItem';
import { useCatalog, useInventoryFurni } from '../../../../../hooks';
import { CatalogPriceGridDisplayWidgetView } from '../widgets/CatalogPriceGridDisplayWidgetView';

interface CatalogGridOfferViewProps extends LayoutGridItemProps
{
    offer: IPurchasableOffer;
    selectOffer: (offer: IPurchasableOffer) => void;
}

export const CatalogGridOfferView: FC<CatalogGridOfferViewProps> = props =>
{
    const { offer = null, selectOffer = null, itemActive = false, ...rest } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { currentOffer = null, requestOfferToMover = null } = useCatalog();
    const { isVisible = false } = useInventoryFurni();

    const iconUrl = useMemo(() =>
        {
            const selectedOffer = itemActive ? currentOffer : offer;
            if(selectedOffer && selectedOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
            {
                return 'https://habboclassic.dk/swfs/dcr/hof_furni/Bundle.png';
            }

            return selectedOffer ? selectedOffer.product.getIconUrl(selectedOffer) : null;
        }, [ currentOffer, offer, itemActive ]);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                selectOffer(offer);
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !itemActive || !isVisible) return;

                requestOfferToMover(offer);
                return;
        }
    }

    const selectedOffer = itemActive ? currentOffer : offer;
    const product = selectedOffer ? selectedOffer.product : null;

        if(!product) return null;

    return (
        <Column className="catalog-grid-active cursor-pointer" gap={ 0 } itemActive={ itemActive } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <LayoutCatalogGridItem itemImage={ iconUrl } itemCount={ ((offer.pricingModel === Offer.PRICING_MODEL_MULTI) ? product.productCount : 1) } itemUniqueSoldout={ (product.uniqueLimitedItemSeriesSize && !product.uniqueLimitedItemsLeft) } itemUniqueNumber={ product.uniqueLimitedItemSeriesSize } { ...rest }>
                { (offer.product.productType === ProductTypeEnum.ROBOT) &&
                <LayoutAvatarImageView figure={ offer.product.extraParam } headOnly={ true } direction={ 3 } /> }
                { (offer.clubLevel === 1) &&
                <Flex>
                   <Base className="icon hc2-icon"></Base>
               </Flex> }
            </LayoutCatalogGridItem>
            <Flex alignItems="end" justifyContent="end" fullWidth gap={ 0 } >
                <Column gap={ 0 }>
                    <CatalogPriceGridDisplayWidgetView offer={ offer } />
                </Column>
            </Flex>
        </Column>
    );
}
