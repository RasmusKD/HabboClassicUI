import { ILinkEventTracker, SecurityLevel } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { AddEventLinkTracker, GetSessionDataManager, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { useCatalog } from '../../hooks';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { CatalogHeaderView } from './views/page/common/CatalogHeaderView';
import { GetCatalogLayout } from './views/page/layout/GetCatalogLayout';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';

export const CatalogView: FC<{}> = props =>
{
    const { isVisible = false, setIsVisible = null, rootNode = null, currentPage = null, navigationHidden = false, setNavigationHidden = null, activeNodes = [], searchResult = null, setSearchResult = null, openPageByName = null, openPageByOfferId = null, getNodeById = null, activateNode = null } = useCatalog();
    const isMod = GetSessionDataManager().securityLevel >= SecurityLevel.EMPLOYEE;


    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'open':
                        if(parts.length > 2)
                        {
                            if(parts.length === 4)
                            {
                                switch(parts[2])
                                {
                                    case 'offerId':
                                        openPageByOfferId(parseInt(parts[3]));
                                        return;
                                }
                            }
                            else
                            {
                                openPageByName(parts[2]);
                            }
                        }
                        else
                        {
                            setIsVisible(true);
                        }

                        return;
                }
            },
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible, openPageByOfferId, openPageByName ]);

    return (
        <>
            { isVisible && isMod && rootNode && (rootNode.children.length > 1) &&
                <NitroCardView id="nitro-catalog" uniqueKey="catalog" className="nitro-catalog" overflow="visible" style={{ minHeight: '628px' }}>
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView subClassName="w-100">
                        { rootNode && (rootNode.children.length > 0) && rootNode.children.map(child =>
                        {
                            if(!child.isVisible) return null;

                            return (
                                <NitroCardTabsItemView key={ child.pageId } isActive={ child.isActive } onClick={ event =>
                                {
                                    if(searchResult) setSearchResult(null);

                                    activateNode(child);
                                } }>
                                    { child.localization }
                                </NitroCardTabsItemView>
                            );
                        }) }
                    </NitroCardTabsView>
                    <CatalogHeaderView node={ rootNode } />
                    <NitroCardContentView className="content-size">
                        <Grid>
                            { !navigationHidden &&
                                <Column className="catalog-left" size={ 4 } overflow="hidden">
                                    { activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={ activeNodes[0] } /> }
                                </Column> }
                            <Column size={ !navigationHidden ? 8 : 12 } overflow="hidden">
                                { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
            { isVisible && rootNode && (rootNode.children.length < 2) &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog2 vert-resize">
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => setIsVisible(false) } />
                    <CatalogHeaderView node={ rootNode } />
                    <NitroCardContentView>
                        <Grid>
                            { !navigationHidden &&
                                <Column className="catalog-left" size={ 4 } overflow="hidden">
                                    { activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={ activeNodes[0] } /> }
                                </Column> }
                            <Column size={ !navigationHidden ? 8 : 12 } overflow="hidden">
                                { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
            <CatalogGiftView />
            <MarketplacePostOfferView />
        </>
    );

}
