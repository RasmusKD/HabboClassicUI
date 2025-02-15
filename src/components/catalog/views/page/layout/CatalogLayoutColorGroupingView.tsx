import { ColorConverter } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { IPurchasableOffer } from '../../../../../api';
import { AutoGrid, Base, Column, Flex, LayoutImage, LayoutCatalogueDiscountView, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';
import { HCColorGridItem } from '../../../../../common';

export interface CatalogLayoutColorGroupViewProps extends CatalogLayoutProps {}

export const CatalogLayoutColorGroupingView: FC<CatalogLayoutColorGroupViewProps> = (props) => {
    const { page = null } = props;
    const [colorableItems, setColorableItems] = useState<Map<string, number[]>>(new Map<string, number[]>());
    const { currentOffer = null, purchaseOptions = null, setCurrentOffer = null } = useCatalog();
    const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

    const sortByColorIndex = (a: IPurchasableOffer, b: IPurchasableOffer) => {
        if (!a.product.furnitureData.colorIndex || !b.product.furnitureData.colorIndex) {
            return 1;
        }
        if (a.product.furnitureData.colorIndex > b.product.furnitureData.colorIndex) {
            return 1;
        }
        if (a === b) {
            return 0;
        }
        return -1;
    };

    const sortByFurnitureClassName = (a: IPurchasableOffer, b: IPurchasableOffer) => {
        if (a.product.furnitureData.className > b.product.furnitureData.className) {
            return 1;
        }
        if (a === b) {
            return 0;
        }
        return -1;
    };

    const selectOffer = (offer: IPurchasableOffer) => {
        offer.activate();
        if (colorableItems.has(offer.product.furnitureData.className)) {
            selectColor(selectedColorIndex, offer.product.furnitureData.className);
        } else {
            setCurrentOffer(offer);
        }
    };

    const selectColor = (colorIndex: number, productName: string) => {
        setSelectedColorIndex(colorIndex);
        const fullName = `${productName}*${colorIndex}`;
        const index = page.offers.findIndex((offer) => offer.product.furnitureData.fullName === fullName);
        if (index > -1) {
            setCurrentOffer(page.offers[index]);
        }
    };

    const offers = useMemo(() => {
        const offers: IPurchasableOffer[] = [];
        const addedColorableItems = new Map<string, boolean>();
        const updatedColorableItems = new Map<string, number[]>();

        page.offers.sort(sortByColorIndex);

        page.offers.forEach((offer) => {
            if (!offer.product) return;

            const furniData = offer.product.furnitureData;

            if (!furniData || !furniData.hasIndexedColor) {
                offers.push(offer);
            } else {
                const name = furniData.className;
                const colorIndex = furniData.colorIndex;

                if (!updatedColorableItems.has(name)) {
                    updatedColorableItems.set(name, []);
                }

                let selectedColor = 0xFFFFFF;

                if (furniData.colors) {
                    for (let color of furniData.colors) {
                        if (color !== 0xFFFFFF) {
                            selectedColor = color;
                        }
                    }

                    if (updatedColorableItems.get(name).indexOf(selectedColor) === -1) {
                        updatedColorableItems.get(name)[colorIndex] = selectedColor;
                    }
                }

                if (!addedColorableItems.has(name)) {
                    offers.push(offer);
                    addedColorableItems.set(name, true);
                }
            }
        });

        offers.sort(sortByFurnitureClassName);
        setColorableItems(updatedColorableItems);
        return offers;
    }, [page.offers]);

    useEffect(() => {
        if (!page || !page.offers.length) return;

        const offer = page.offers[26];
        setCurrentOffer(offer);
    }, [page, setCurrentOffer]);

    useEffect(() => {
        if (currentOffer && currentOffer.product.furnitureData.hasIndexedColor) {
            setSelectedColorIndex(currentOffer.product.furnitureData.colorIndex);
        }
    }, [currentOffer]);

    return (
        <div className="h-default-colors">
            <Column className="position-relative catalog-default-image" center={!currentOffer} size={5} overflow="hidden">
                {!currentOffer && (
                    <>
                        {!!page.localization.getImage(1) && <LayoutImage imageUrl={page.localization.getImage(1)} />}
                    </>
                )}
                {currentOffer && (
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                        </Base>
                        <Column grow gap={1}>
                            <Text bold variant="white" className="item-title" grow truncate>
                                {currentOffer.localizationName}
                            </Text>
                        </Column>
                    </>
                )}
            </Column>
            <Column className="grid-bg h-itemgrid p-2" size={7} overflow="hidden">
                <AutoGrid className="items-padding overlayscroll" columnCount={6} columnMinWidth={40} columnMinHeight={40}>
                    {offers.map((offer, index) => (
                        <CatalogGridOfferView
                            key={index}
                            itemActive={
                                currentOffer &&
                                (currentOffer.product.furnitureData.hasIndexedColor
                                    ? currentOffer.product.furnitureData.className === offer.product.furnitureData.className
                                    : currentOffer.offerId === offer.offerId)
                            }
                            offer={offer}
                            selectOffer={selectOffer}
                        />
                    ))}
                </AutoGrid>
            </Column>
            <Column className="grid-bg color-selector-height" size={7} overflow="hidden">
                <AutoGrid className="colors-padding" gap={1} columnCount={11} columnMinWidth={28} columnMinHeight={40}>
                    {currentOffer && colorableItems.has(currentOffer.product.furnitureData.className) &&
                        colorableItems.get(currentOffer.product.furnitureData.className).map((color, index) => (
                            <HCColorGridItem
                                itemHighlight
                                key={index}
                                itemActive={currentOffer.product.furnitureData.colorIndex === index}
                                itemColor={ColorConverter.int2rgb(color)}
                                className="clear-bg"
                                onClick={(event) => selectColor(index, currentOffer.product.furnitureData.className)}
                            />
                        ))
                    }
                </AutoGrid>
            </Column>
            <Flex gap={1} className="quanity-container mt-2">
                <CatalogSpinnerWidgetView />
                {purchaseOptions?.isDiscount && (
                    <LayoutCatalogueDiscountView amountFree={purchaseOptions?.amountFree} />
                )}
                <CatalogTotalPriceWidget className="credits-default2-layout" alignItems="end" />
            </Flex>
            <Flex gap={2} className="purchase-buttons align-items-end mt-1">
                <CatalogPurchaseWidgetView />
            </Flex>
        </div>
    );
};
