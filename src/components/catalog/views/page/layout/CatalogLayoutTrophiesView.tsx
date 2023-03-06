import { FC, useEffect, useState } from 'react';
import { Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ trophyText, setTrophyText ] = useState<string>('');
    const { currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null, currentPage = null } = useCatalog();

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.extraData = trophyText;

            return newValue;
        });
    }, [ currentOffer, trophyText, setPurchaseOptions ]);

        useEffect(() =>
        {
            if(!currentPage || !currentPage.offers.length) return;

            setCurrentOffer(currentPage.offers[0]);
        }, [ currentPage, setCurrentOffer ]);

    return (
        <div className="h-default-trophys">
            <Column className="pt-2" center={ !currentOffer } overflow="hidden">
                    <>
                        <Text small center dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
                    </>
            </Column>
            <Column size={ 7 } overflow="hidden">
                <Column className="grid-bg item-picker p-2" size={ 7 } overflow="hidden">
                    <CatalogItemGridWidgetView />
                </Column>
            </Column>
                { currentOffer &&
            <>
                <Column className="h-itemgrid" size={ 7 } overflow="hidden">
                    <Text center truncate>{ currentOffer.localizationName }</Text>
                    <textarea spellCheck="false" className="flex-grow-1 form-control w-100 " defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
                    <Flex justifyContent="end">
                        <CatalogTotalPriceWidget alignItems="end" className="credits-bg" />
                    </Flex>
                    <Flex gap={ 2 } className="purchase-buttons align-items-end">
                    <CatalogPurchaseWidgetView />
                    </Flex>
                </Column>
            </> }
        </div>
    );
}
