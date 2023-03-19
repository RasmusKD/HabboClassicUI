import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { GroupItem, LocalizeText } from '../../../../api';
import { Button, Flex } from '../../../../common';

export interface InventoryFurnitureSearchViewProps
{
    groupItems: GroupItem[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}

export const InventoryFurnitureSearchView: FC<InventoryFurnitureSearchViewProps> = props =>
{
    const { groupItems = [], setGroupItems = null } = props;
    const [searchValue, setSearchValue] = useState(() => {
        return sessionStorage.getItem("inventorySearchValue") || "";
    });

    useEffect(() => {
        sessionStorage.setItem("inventorySearchValue", searchValue);
    }, [searchValue]);

    useEffect(() =>
    {
        let filteredGroupItems = [ ...groupItems ];

        if(searchValue && searchValue.length)
        {
            const comparison = searchValue.toLocaleLowerCase();

            filteredGroupItems = groupItems.filter(item =>
            {
                if(comparison && comparison.length)
                {
                    if(item.name.toLocaleLowerCase().includes(comparison)) return item;
                }

                return null;
            });
        }

        setGroupItems(filteredGroupItems);
    }, [ groupItems, setGroupItems, searchValue ]);

    return (
        <Flex gap={ 1 }>
            <input spellCheck="false" type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
        { searchValue && !!searchValue.length &&
            <i className="icon icon-clear position-absolute clear-button" onClick={ event => setSearchValue('') }/> }
        </Flex>
    );
}
