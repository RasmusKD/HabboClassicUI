import { IObjectData, TradingListAddItemComposer, TradingListAddItemsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaLock, FaUnlock } from 'react-icons/fa';
import { FurniCategory, getGuildFurniType, GroupItem, IFurnitureItem, LocalizeText, NotificationAlertType, SendMessageComposer, TradeState } from '../../../../api';
import { AutoGrid, Base, Button, Column, Flex, Grid, LayoutGridFurni, Text } from '../../../../common';
import { useInventoryTrade, useNotification } from '../../../../hooks';
import { InventoryFurnitureSearchView } from './InventoryFurnitureSearchView';

interface InventoryTradeViewProps
{
    cancelTrade: () => void;
}

const MAX_ITEMS_TO_TRADE: number = 9;

export const InventoryTradeView: FC<InventoryTradeViewProps> = props =>
{
    const { cancelTrade = null } = props;
    const [ groupItem, setGroupItem ] = useState<GroupItem>(null);
    const [ ownGroupItem, setOwnGroupItem ] = useState<GroupItem>(null);
    const [ otherGroupItem, setOtherGroupItem ] = useState<GroupItem>(null);
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(null);
    const [ countdownTick, setCountdownTick ] = useState(3);
    const [ offerItems, setofferItems ] = useState<number>(1);
    const { ownUser = null, otherUser = null, groupItems = [], tradeState = TradeState.TRADING_STATE_READY, progressTrade = null, removeItem = null, setTradeState = null } = useInventoryTrade();
    const { simpleAlert = null } = useNotification();

    const canTradeItem = (isWallItem: boolean, spriteId: number, category: number, groupable: boolean, stuffData: IObjectData) =>
    {
        if(!ownUser || ownUser.accepts || !ownUser.userItems) return false;

        if(ownUser.userItems.length < MAX_ITEMS_TO_TRADE) return true;

        if(!groupable) return false;

        let type = spriteId.toString();

        if(category === FurniCategory.POSTER)
        {
            type = ((type + 'poster') + stuffData.getLegacyString());
        }
        else
        {
            if(category === FurniCategory.GUILD_FURNI)
            {
                type = getGuildFurniType(spriteId, stuffData);
            }
            else
            {
                type = (((isWallItem) ? 'I' : 'S') + type);
            }
        }

        return !!ownUser.userItems.getValue(type);
    }

    const attemptItemOffer = (count: number) =>
    {
        if(!groupItem) return;

        const tradeItems = groupItem.getTradeItems(count);

        if(!tradeItems || !tradeItems.length) return;

        let coreItem: IFurnitureItem = null;
        const itemIds: number[] = [];

        for(const item of tradeItems)
        {
            itemIds.push(item.id);

            if(!coreItem) coreItem = item;
        }

        const ownItemCount = ownUser.userItems.length;

        if((ownItemCount + itemIds.length) <= 1500)
        {
            if(!coreItem.isGroupable && (itemIds.length))
            {
                SendMessageComposer(new TradingListAddItemComposer(itemIds.pop()));
            }
            else
            {
                const tradeIds: number[] = [];

                for(const itemId of itemIds)
                {
                    if(canTradeItem(coreItem.isWallItem, coreItem.type, coreItem.category, coreItem.isGroupable, coreItem.stuffData))
                    {
                        tradeIds.push(itemId);
                    }
                }

                if(tradeIds.length)
                {
                    if(tradeIds.length === 1)
                    {
                        SendMessageComposer(new TradingListAddItemComposer(tradeIds.pop()));
                    }
                    else
                    {
                        SendMessageComposer(new TradingListAddItemsComposer(...tradeIds));
                    }
                }
            }
        }
        else
        {
            simpleAlert(LocalizeText('trading.items.too_many_items.desc'), NotificationAlertType.DEFAULT, null, null, LocalizeText('trading.items.too_many_items.title'));
        }
    }

    const getLockIcon = (accepts: boolean) =>
    {
        const iconName = accepts ? 'locked' : 'open';

        return <i className={ 'mt-auto pb-5 icon icon-lock-' + iconName } />
    }

    useEffect(() =>
    {
        if(tradeState !== TradeState.TRADING_STATE_COUNTDOWN) return;

        setCountdownTick(3);

        const interval = setInterval(() =>
        {
            setCountdownTick(prevValue =>
            {
                const newValue = (prevValue - 1);

                if(newValue === 0) clearInterval(interval);

                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ tradeState, setTradeState ]);

    useEffect(() =>
    {
        if(countdownTick !== 0) return;

        setTradeState(TradeState.TRADING_STATE_CONFIRMING);
    }, [ countdownTick, setTradeState ]);

    if((tradeState === TradeState.TRADING_STATE_READY) || !ownUser || !otherUser) return null;

    return (
        <Column>
            <Flex>
                <Column size={ 4 } fullWidth overflow="hidden" className="trading-inventory">
                    <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                    <Flex column fullHeight fullWidth justifyContent="between" overflow="hidden" gap={ 2 }>
                        <AutoGrid columnCount={ 3 } gap={ 1 } className="flash-inventory">
                            { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) =>
                            {
                                const count = item.getUnlockedCount();

                                return (
                                    <LayoutGridFurni key={ index } className={ !count ? 'opacity-0-5 ' : '' } itemImage={ item.iconUrl } itemCount={ count } itemActive={ (groupItem === item) } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => (count && setGroupItem(item)) } onDoubleClick={ event => attemptItemOffer(1) }>
                                        { ((count > 0) && (groupItem === item)) &&
                                    <Button position="absolute" variant="success" className="trade-button bottom-1 end-1" onClick={ event => attemptItemOffer(1) }>
                                        <FaChevronRight className="fa-icon" />
                                    </Button> }
                                    </LayoutGridFurni>
                                );
                            }) }
                        </AutoGrid>
                        <Base fullWidth className="badge bg-muted">
                            { groupItem ? groupItem.name : LocalizeText('catalog_selectproduct') }
                        </Base>
                    </Flex>
                </Column>
            </Flex>
            <Column fullWidth size={ 8 } overflow="hidden" className="trade-bg p-2">
                <Grid overflow="hidden">
                    <Column size={ 4 } overflow="hidden">
                        <Flex justifyContent="between" alignItems="center">
                            <Text>{ LocalizeText('inventory.trading.you') } { LocalizeText('inventory.trading.areoffering') }:</Text>
                        </Flex>
                        <AutoGrid columnCount={ 3 } gap={ 1 }>
                            { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                            {
                                const item = (ownUser.userItems.getWithIndex(i) || null);

                                if(!item) return <LayoutGridFurni key={ i } />;

                                return (
                                    <LayoutGridFurni key={ i } itemActive={ (ownGroupItem === item) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setOwnGroupItem(item) } onDoubleClick={ event => removeItem(item) }>
                                        { (ownGroupItem === item) &&
                                        <Button position="absolute" variant="danger" className="trade-button bottom-1 start-1" onClick={ event => removeItem(item) }>
                                            <FaChevronLeft className="fa-icon" />
                                        </Button> }
                                    </LayoutGridFurni>
                                );
                            }) }
                        </AutoGrid>
                        <Base fullWidth className="badge bg-muted">
                            { ownGroupItem ? ownGroupItem.name : LocalizeText('catalog_selectproduct') }
                        </Base>
                    </Column>
                    { getLockIcon(ownUser.accepts) }
                    <Column size={ 4 } overflow="hidden">
                        <Flex justifyContent="between" alignItems="center">
                            <Text>{ otherUser.userName } { LocalizeText('inventory.trading.isoffering') }:</Text>
                        </Flex>
                        <AutoGrid columnCount={ 3 } gap={ 1 }>
                            { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                            {
                                const item = (otherUser.userItems.getWithIndex(i) || null);

                                if(!item) return <LayoutGridFurni key={ i } />;

                                return <LayoutGridFurni key={ i } itemActive={ (otherGroupItem === item) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setOtherGroupItem(item) } />;
                            }) }
                        </AutoGrid>
                        <Base fullWidth className="badge bg-muted w-100">
                            { otherGroupItem ? otherGroupItem.name : LocalizeText('catalog_selectproduct') }
                        </Base>
                    </Column>
                    { getLockIcon(otherUser.accepts) }
                    <Column size={ 2 }>
                        <Text>{ LocalizeText('catalog.bundlewidget.quantity') }</Text>
                        <input type="number" className="form-control form-control-sm quantity-input" value={ offerItems } onChange={ event => setofferItems(event.target.valueAsNumber) }/>
                        <Flex alignItems="center" gap={ 1 }>
                            <Button variant="danger" className="button-width" onClick={ event => attemptItemOffer(offerItems) }>{ LocalizeText('inventory.trading.offer') }</Button>
                        </Flex>
                    </Column>
                </Grid>
                <Flex grow justifyContent="between">
                    { (tradeState === TradeState.TRADING_STATE_READY) &&
                        <Button variant="secondary" disabled={ (!ownUser.itemCount && !otherUser.itemCount) } onClick={ progressTrade }>{ LocalizeText('inventory.trading.accept') }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_RUNNING) &&
                        <Button variant="secondary" disabled={ (!ownUser.itemCount && !otherUser.itemCount) } onClick={ progressTrade }>{ LocalizeText(ownUser.accepts ? 'inventory.trading.modify' : 'inventory.trading.accept') }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_COUNTDOWN) &&
                        <Button variant="secondary" disabled>{ LocalizeText('inventory.trading.countdown', [ 'counter' ], [ countdownTick.toString() ]) }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_CONFIRMING) &&
                        <Button variant="secondary" onClick={ progressTrade }>{ LocalizeText('inventory.trading.button.restore') }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_CONFIRMED) &&
                        <Button variant="secondary">{ LocalizeText('inventory.trading.info.waiting') }</Button> }
                    <Button variant="danger" onClick={ cancelTrade }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </Column>
        </Column>
    );
}
