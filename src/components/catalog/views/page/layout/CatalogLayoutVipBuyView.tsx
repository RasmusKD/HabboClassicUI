import { ClubOfferData, GetClubOffersMessageComposer, PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogPurchaseState, CreateLinkEvent, LocalizeText, SendMessageComposer } from '../../../../../api';
import { AutoGrid, Button, Column, Flex, Grid, LayoutCurrencyIconBig, LayoutHCCataGridItem, LayoutLoadingSpinnerView, Text } from '../../../../../common';
import { CatalogEvent, CatalogPurchasedEvent, CatalogPurchaseFailureEvent } from '../../../../../events';
import { useCatalog, usePurse, useUiEvent } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutVipBuyView: FC<CatalogLayoutProps> = props =>
{
    const [ pendingOffer, setPendingOffer ] = useState<ClubOfferData>(null);
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE);
    const { currentPage = null, catalogOptions = null } = useCatalog();
    const { purse = null, getCurrencyAmount = null } = usePurse();
    const { clubOffers = null } = catalogOptions;

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                setPurchaseState(CatalogPurchaseState.NONE);
                return;
            case CatalogPurchaseFailureEvent.PURCHASE_FAILED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
        }
    }, []);

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent);

    const getOfferText = useCallback((offer: ClubOfferData) =>
    {
        let offerText = '';

        if(offer.months > 0)
        {
            offerText = LocalizeText('catalog.vip.item.header.months', [ 'num_months' ], [ offer.months.toString() ]);
        }

        if(offer.extraDays > 0)
        {
            if(offerText !== '') offerText += ' ';

            offerText += (' ' + LocalizeText('catalog.vip.item.header.days', [ 'num_days' ], [ offer.extraDays.toString() ]));
        }

        return offerText;
    }, []);

    const getPurchaseHeader = useCallback(() =>
    {
        if(!purse) return '';

        const extensionOrSubscription = (purse.clubDays > 0 || purse.clubPeriods > 0) ? 'extension.' : 'subscription.';
        const daysOrMonths = ((pendingOffer.months === 0) ? 'days' : 'months');
        const daysOrMonthsText = ((pendingOffer.months === 0) ? pendingOffer.extraDays : pendingOffer.months);
        const locale = LocalizeText('catalog.vip.buy.confirm.' + extensionOrSubscription + daysOrMonths, [ 'num_months' ], [ pendingOffer.months.toString() ]);

        return locale.replace('%NUM_' + daysOrMonths.toUpperCase() + '%', daysOrMonthsText.toString());
    }, [ pendingOffer, purse ]);

    const getPurchaseValidUntil = useCallback(() =>
    {
        let locale = LocalizeText('catalog.vip.buy.confirm.end_date');

        locale = locale.replace('%month%', pendingOffer.month.toString());
        locale = locale.replace('%day%', pendingOffer.day.toString());
        locale = locale.replace('%year%', pendingOffer.year.toString());

        return locale;
    }, [ pendingOffer ]);

    const getSubscriptionDetails = useMemo(() =>
    {
        const clubDays = purse.clubDays;
        const clubPeriods = purse.clubPeriods;
        const totalDays = (clubPeriods * 31) + clubDays;

        return LocalizeText('catalog.vip.extend.info', [ 'days' ], [ totalDays.toString() ]);
    }, [ purse ]);

    const purchaseSubscription = useCallback(() =>
    {
        if(!pendingOffer) return;

        setPurchaseState(CatalogPurchaseState.PURCHASE);
        SendMessageComposer(new PurchaseFromCatalogComposer(currentPage.pageId, pendingOffer.offerId, null, 1));
    }, [ pendingOffer, currentPage ]);

    const setOffer = useCallback((offer: ClubOfferData) =>
    {
        setPurchaseState(CatalogPurchaseState.NONE);
        setPendingOffer(offer);
    }, []);

    const getPurchaseButton = useCallback(() =>
    {
        if(!pendingOffer) return null;

        if(pendingOffer.priceCredits > getCurrencyAmount(-1))
        {
            return <Button variant="danger">{ LocalizeText('catalog.alert.notenough.title') }</Button>;
        }

        if(pendingOffer.priceActivityPoints > getCurrencyAmount(pendingOffer.priceActivityPointsType))
        {
            return <Button variant="danger">{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + pendingOffer.priceActivityPointsType) }</Button>;
        }

        switch(purchaseState)
        {
            case CatalogPurchaseState.CONFIRM:
                return <Button className="hc-buy-button-width" variant="warning" onClick={ purchaseSubscription }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>;
            case CatalogPurchaseState.PURCHASE:
                return <Button className="hc-buy-button-width" variant="primary" disabled><LayoutLoadingSpinnerView /></Button>;
            case CatalogPurchaseState.FAILED:
                return <Button className="hc-buy-button-width" variant="danger" disabled>{ LocalizeText('generic.failed') }</Button>;
            case CatalogPurchaseState.NONE:
            default:
                return <Button className="hc-buy-button-width" variant="success" onClick={ () => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('buy') }</Button>;
        }
    }, [ pendingOffer, purchaseState, purchaseSubscription, getCurrencyAmount ]);

    useEffect(() =>
    {
        if(!clubOffers) SendMessageComposer(new GetClubOffersMessageComposer(1));
    }, [ clubOffers ]);

    useEffect(() =>
    {
        if(!clubOffers || !clubOffers.length) return;

        setPendingOffer(clubOffers[0]);
    }, [ clubOffers, setPendingOffer ]);

    return (
        <Column fullHeight>
            <Flex className="hc-img-height" overflow="hidden">
                { currentPage.localization.getImage(1) && <img draggable="false" alt="" src={ currentPage.localization.getImage(1) } /> }
                { purse.clubDays > 0 &&
                <Column className="px-2">
                    <Text bold>{ LocalizeText('catalog.vip.extend.title') }</Text>
                    <Text small overflow="auto" dangerouslySetInnerHTML={ { __html: getSubscriptionDetails } } />
                </Column> }
                { purse.clubDays < 1 &&
                <Column className="px-2">
                    <Text bold>{ LocalizeText('catalog.vip.buy.title') }</Text>
                    <Text small overflow="auto">{ LocalizeText('catalog.vip.buy.info') }</Text>
                </Column> }
            </Flex>
            <Column fullHeight size={ 7 } overflow="hidden" justifyContent="between">
                <AutoGrid columnCount={ 1 } className="nitro-catalog-layout-vip-buy-grid">
                    { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                    {
                        return (
                            <LayoutHCCataGridItem key={ index } column={ false } center={ false } justifyContent="between" itemActive={ pendingOffer === offer } className="hc-padding">
                                <Column className="w-100">
                                    <Flex className="hc-title-bg" gap={ 2 }>
                                        <i className="icon-hc-small-banner" />
                                        <Text bold variant="white">{ getOfferText(offer) }</Text>
                                    </Flex>
                                    <Flex className="hc-product-height" justifyContent="between" gap={ 1 }>
                                        { (offer.priceCredits > 0) &&
                                    <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                        <Text bold>{ offer.priceCredits }</Text>
                                        <LayoutCurrencyIconBig type={ -1 } />
                                    </Flex> }
                                        { (offer.priceActivityPoints > 0) &&
                                    <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                        <Text bold>{ offer.priceActivityPoints }</Text>
                                        <LayoutCurrencyIconBig type={ offer.priceActivityPointsType } />
                                    </Flex> }
                                        { getPurchaseButton() }
                                    </Flex>
                                </Column>
                            </LayoutHCCataGridItem>
                        );
                    }) }
                </AutoGrid>
            </Column>
            <Column className="hc-end-text-margin" fullHeight size={ 7 } overflow="hidden" justifyContent="end">
                <Text small>
                    { LocalizeText('catalog.vip.buy.hccenter') }
                    <u className="ms-1 cursor-pointer" onClick={ () => CreateLinkEvent('habboUI/open/hccenter') }>HC Center &gt;&gt;</u>
                </Text>
            </Column>
        </Column>
    );
}
