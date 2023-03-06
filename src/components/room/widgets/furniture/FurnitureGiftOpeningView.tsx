import { FC } from 'react';
import { attemptItemPlacement, CreateLinkEvent, LocalizeText } from '../../../../api';
import { Button, Column, Flex, LayoutGiftTagView, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurniturePresentWidget, useInventoryFurni } from '../../../../hooks';

export const FurnitureGiftOpeningView: FC<{}> = props =>
{
    const { objectId = -1, classId = -1, itemType = null, text = null, isOwnerOfFurniture = false, senderName = null, senderFigure = null, placedItemId = -1, placedItemType = null, placedInRoom = false, imageUrl = null, openPresent = null, onClose = null } = useFurniturePresentWidget();
    const { groupItems = [] } = useInventoryFurni();
    
    if(objectId === -1) return null;
	
    const place = (itemId: number) =>
    {
        const groupItem = groupItems.find(group => (group.getItemById(itemId)?.id === itemId));
        if(groupItem) attemptItemPlacement(groupItem);
        onClose();
    }
    
    return (
        <NitroCardView className="nitro-gift-opening" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText(senderName ? 'widget.furni.present.window.title_from' : 'widget.furni.present.window.title', [ 'name' ], [ senderName ]) } onCloseClick={ onClose } />
            <NitroCardContentView center>
                { (placedItemId === -1) &&
                    <Column overflow="hidden">
                        <Flex center overflow="auto">
                            <LayoutGiftTagView userName={ senderName } figure={ senderFigure } message={ text } />
                        </Flex>
                        { isOwnerOfFurniture &&
                            <Flex gap={ 1 }>
                                <Button fullWidth variant="success" onClick={ openPresent }>
                                    { LocalizeText('widget.furni.present.open_gift') }
                                </Button>
                            </Flex> }
                    </Column> }
                { (placedItemId > -1) &&
                    <Column overflow="hidden">
                            <Flex center overflow="auto" className="gift-margin" gap={ 2 }>
                                <LayoutImage imageUrl={ imageUrl } className="no-select" />
                                <Text wrap small>{ LocalizeText('widget.furni.present.message_opened', [ 'product' ], [ text ]) }</Text>
                            </Flex >
                            <Column grow gap={ 1 }>
                                <Flex gap={ 1 }>
                                    <Button fullWidth variant="success" onClick={ onClose }>
                                        { LocalizeText('widget.furni.present.put_in_inventory') }
                                    </Button>
                                </Flex>
                            </Column>
                        </Column> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
