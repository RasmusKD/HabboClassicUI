import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, PropsWithChildren, useState } from 'react';
import { attemptPetPlacement, IPetItem, UnseenItemCategory } from '../../../../api';
import { LayoutGridFurni, LayoutPetImageView } from '../../../../common';
import { useInventoryPets, useInventoryUnseenTracker } from '../../../../hooks';

export const InventoryPetItemView: FC<PropsWithChildren<{ petItem: IPetItem }>> = props =>
{
    const { petItem = null, children = null, ...rest } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { selectedPet = null, setSelectedPet = null } = useInventoryPets();
    const { isUnseen } = useInventoryUnseenTracker();
    const unseen = isUnseen(UnseenItemCategory.PET, petItem.petData.id);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                setSelectedPet(petItem);
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !(petItem === selectedPet)) return;

                attemptPetPlacement(petItem);
                return;
            case 'dblclick':
                attemptPetPlacement(petItem);
                return;
        }
    }

    return (
        <LayoutGridFurni itemActive={ (petItem === selectedPet) } itemUnseen={ unseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } { ...rest }>
            <LayoutPetImageView figure={ petItem.petData.figureData.figuredata } direction={ 3 } headOnly={ true } />
            { children }
        </LayoutGridFurni>
    );
}
