import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { INavigatorSearchFilter, LocalizeText, SearchFilterOptions } from '../../../../api';
import { Button, Flex } from '../../../../common';
import { useNavigator } from '../../../../hooks';

export interface NavigatorSearchViewProps
{
    sendSearch: (searchValue: string, contextCode: string) => void;
}

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const { sendSearch = null } = props;
    const [ searchFilterIndex, setSearchFilterIndex ] = useState(0);
    const [searchValue, setSearchValue] = useState(() => {
        return sessionStorage.getItem("NavigatorSearchValue") || "";
    });
    const { topLevelContext = null, searchResult = null } = useNavigator();
    const [ isOpen, setIsOpen ] = useState(false);
    const [clearedSearch, setClearedSearch] = useState(false);

    function handleSelectClick() {
        setIsOpen(!isOpen);
    }

    function handleSelectBlur() {
        setIsOpen(false);
    }

    const processSearch = () =>
    {
        if(!topLevelContext) return;

        let searchFilter = SearchFilterOptions[searchFilterIndex];

        if(!searchFilter) searchFilter = SearchFilterOptions[0];

        const searchQuery = ((searchFilter.query ? (searchFilter.query + ':') : '') + searchValue);

        sendSearch((searchQuery || ''), topLevelContext.code);
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        processSearch();
    };

    useEffect(() => {
        if (searchValue === '' && clearedSearch) {
            processSearch();
            setClearedSearch(false);
        }
    }, [searchValue, clearedSearch]);

    useEffect(() =>
    {
        if(!searchResult) return;

        const split = searchResult.data.split(':');

        let filter: INavigatorSearchFilter = null;
        let value: string = '';

        if(split.length >= 2)
        {
            const [ query, ...rest ] = split;

            filter = SearchFilterOptions.find(option => (option.query === query));
            value = rest.join(':');
        }
        else
        {
            value = searchResult.data;
        }

        if(!filter) filter = SearchFilterOptions[0];

        setSearchFilterIndex(SearchFilterOptions.findIndex(option => (option === filter)));
        setSearchValue(value);
    }, [ searchResult ]);

    useEffect(() => {
        sessionStorage.setItem("NavigatorSearchValue", searchValue);
    }, [searchValue]);

    return (
        <Flex fullWidth gap={ 1 }>
            <Flex shrink>
                <select className={`form-select form-select-sm form-select-navigator ${isOpen ? 'active' : ''}`} value={ searchFilterIndex } onChange={ event => setSearchFilterIndex(parseInt(event.target.value)) } onClick={handleSelectClick} onBlur={handleSelectBlur}>
                    { SearchFilterOptions.map((filter, index) =>
                    {
                        return <option key={ index } value={ index }>{ LocalizeText('navigator.filter.' + filter.name) }</option>
                    }) }
                </select>
            </Flex>
            <Flex fullWidth gap={ 2 }>
                <input spellCheck="false" type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
            { (!searchValue || !searchValue.length) &&
                <i className="icon icon-pen position-absolute navigator-search-button"/> }
            { searchValue && !!searchValue.length &&
                <i className="icon icon-clear position-absolute navigator-clear-button" onClick={event => { setSearchValue(''); setClearedSearch(true); }} /> }
            </Flex>
        </Flex>
    );
}
