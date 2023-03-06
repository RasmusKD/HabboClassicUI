import { Vector3d } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { FurniCategory, GetAvatarRenderManager, GetSessionDataManager, Offer, ProductTypeEnum } from '../../../../../api';
import { AutoGrid, Base, Column, Flex, LayoutGridBlank, LayoutRoomPreviewerView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export const CatalogViewProductWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, roomPreviewer = null, purchaseOptions = null } = useCatalog();
    const { previewStuffData = null } = purchaseOptions;

    useEffect(() =>
    {
        if(!currentOffer || (currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE) || !roomPreviewer) return;

        const product = currentOffer.product;

        if(!product) return;

        roomPreviewer.reset(false);

        switch(product.productType)
        {
            case ProductTypeEnum.FLOOR: {
                if(!product.furnitureData) return;

                if(product.furnitureData.specialType === FurniCategory.FIGURE_PURCHASABLE_SET)
                {
                    const furniData = GetSessionDataManager().getFloorItemData(product.furnitureData.id);
                    const customParts = furniData.customParams.split(',').map(value => parseInt(value));
                    const figureSets: number[] = [];

                    for(const part of customParts)
                    {
                        if(GetAvatarRenderManager().isValidFigureSetForGender(part, GetSessionDataManager().gender)) figureSets.push(part);
                    }

                    const figureString = GetAvatarRenderManager().getFigureStringWithFigureIds(GetSessionDataManager().figure, GetSessionDataManager().gender, figureSets);

                    roomPreviewer.addAvatarIntoRoom(figureString, product.productClassId)
                }
                else
                {
                    roomPreviewer.addFurnitureIntoRoom(product.productClassId, new Vector3d(90), previewStuffData, product.extraParam);
                }
                return;
            }
            case ProductTypeEnum.WALL: {
                if(!product.furnitureData) return;

                switch(product.furnitureData.specialType)
                {
                    case FurniCategory.FLOOR:
                        roomPreviewer.updateObjectRoom(product.extraParam);
                        return;
                    case FurniCategory.WALL_PAPER:
                        roomPreviewer.updateObjectRoom(null, product.extraParam);
                        return;
                    case FurniCategory.LANDSCAPE: {
                        roomPreviewer.updateObjectRoom(null, null, product.extraParam);

                        const furniData = GetSessionDataManager().getWallItemDataByName('ads_twi_windw');

                        if(furniData) roomPreviewer.addWallItemIntoRoom(furniData.id, new Vector3d(90), furniData.customParams);
                        return;
                    }
                    default:
                        roomPreviewer.updateObjectRoom('default', 'default', 'default');
                        roomPreviewer.addWallItemIntoRoom(product.productClassId, new Vector3d(90), product.extraParam);
                        return;
                }
            }
            case ProductTypeEnum.ROBOT:
                roomPreviewer.addAvatarIntoRoom(product.extraParam, 0);
                return;
            case ProductTypeEnum.EFFECT:
                roomPreviewer.addAvatarIntoRoom(GetSessionDataManager().figure, product.productClassId);
                return;
        }
    }, [ currentOffer, previewStuffData, roomPreviewer ]);

    if(!currentOffer) return null;

    if(currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
    {
        return (
            <Flex fit overflow="hidden">
                <AutoGrid columnCount={ 4 } gap={ 0 } className="items-overlay bundle-position nitro-catalog-layout-bundle-grid">
                    { (currentOffer.products.length > 0) && currentOffer.products.map((product, index) =>
                    {
                        return <LayoutGridBlank key={ index } itemImage={ product.getIconUrl(currentOffer) } itemCount={ product.productCount } />;
                    }) }
                </AutoGrid>
                <Base className="bundle-deals"></Base>
            </Flex>
        );
    }

    return <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 235 } />;
}
