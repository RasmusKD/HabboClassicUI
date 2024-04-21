import { FC, useEffect, useState } from 'react';
import { LocalizeBadgeName, LocalizeText, UnseenItemCategory } from '../../../../api';
import { AutoGrid, Button, Column, Flex, LayoutBadgeImageView, Text } from '../../../../common';
import { useInventoryBadges, useInventoryUnseenTracker } from '../../../../hooks';
import { InventoryBadgeItemView } from './InventoryBadgeItemView';

export const InventoryBadgeView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { badgeCodes = [], activeBadgeCodes = [], selectedBadgeCode = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, getBadgeId = null, activate = null, deactivate = null } = useInventoryBadges();
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!selectedBadgeCode || !isUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode))) return;

        removeUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode));
    }, [ selectedBadgeCode, isUnseen, removeUnseen, getBadgeId ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    return (
        <Flex className="h-100">
            <Column className="inventory-furni-size" overflow="hidden">
                <AutoGrid columnCount={ 4 } gap={ 1 } className="flash-inventory">
                    { badgeCodes && (badgeCodes.length > 0) && badgeCodes.map((badgeCode, index) =>
                    {
                        if(isWearingBadge(badgeCode)) return null;

                        return <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />
                    }) }
                </AutoGrid>
            </Column>
            <Column className="justify-content-between inventory-preview-size2">
                <Column overflow="hidden" gap={ 2 }>
                    <Text bold center>{ LocalizeText('inventory.badges.activebadges') }</Text>
                    <AutoGrid columnCount={ 3 } gap={ 1 }>
                        { activeBadgeCodes && (activeBadgeCodes.length > 0) && activeBadgeCodes.map((badgeCode, index) => <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />) }
                    </AutoGrid>
                </Column>
                { !!selectedBadgeCode &&
                    <Column grow justifyContent="end" gap={ 2 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <LayoutBadgeImageView shrink badgeCode={ selectedBadgeCode } />
                            <Text className="badge-name-text">{ LocalizeBadgeName(selectedBadgeCode) }</Text>
                        </Flex>
                        <Button disabled={ !isWearingBadge(selectedBadgeCode) && !canWearBadges() } onClick={ event => toggleBadge(selectedBadgeCode) }>{ LocalizeText(isWearingBadge(selectedBadgeCode) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</Button>
                    </Column> }
            </Column>
        </Flex>
    );
}
