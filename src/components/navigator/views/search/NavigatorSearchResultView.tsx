import { NavigatorSearchComposer, NavigatorSearchResultList } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, NavigatorSearchResultViewDisplayMode, SendMessageComposer } from '../../../../api';
import { AutoGrid, AutoGridProps, Column, Flex, Grid, Text } from '../../../../common';
import { useNavigator } from '../../../../hooks';
import { NavigatorSearchResultItemView } from './NavigatorSearchResultItemView';

export interface NavigatorSearchResultViewProps extends AutoGridProps
{
    searchResult: NavigatorSearchResultList;
}

export const NavigatorSearchResultView: FC<NavigatorSearchResultViewProps> = props =>
{
    const { searchResult = null, ...rest } = props;

    const [ isExtended, setIsExtended ] = useState(true);
    const [ displayMode, setDisplayMode ] = useState<number>(0);

    const { topLevelContext = null } = useNavigator();

    const getResultTitle = () =>
    {
        let name = searchResult.code;

        if(!name || !name.length || LocalizeText('navigator.searchcode.title.' + name) == ('navigator.searchcode.title.' + name)) return searchResult.data;

        if(name.startsWith('${')) return name.slice(2, (name.length - 1));

        return ('navigator.searchcode.title.' + name);
    }

    const toggleDisplayMode = () =>
    {
        setDisplayMode(prevValue =>
        {
            if(prevValue === NavigatorSearchResultViewDisplayMode.LIST) return NavigatorSearchResultViewDisplayMode.THUMBNAILS;

            return NavigatorSearchResultViewDisplayMode.LIST;
        });
    }

    useEffect(() =>
    {
        if(!searchResult) return;

        // setIsExtended(!searchResult.closed);

        setDisplayMode(searchResult.mode);
    }, [ searchResult ]);

    const gridHasTwoColumns = (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS);

    return (
        <Column className="bg-white" gap={ 0 }>
            <Flex fullWidth alignItems="center" justifyContent="between" className="px-2 py-1">
                <Flex grow pointer alignItems="center" gap={ 1 } onClick={ event => setIsExtended(prevValue => !prevValue) }>
                    <i className={ isExtended ? 'icon icon-nav-minus' : 'icon icon-nav-plus' } />
                    <div className="nav-category"> { LocalizeText(getResultTitle()) }</div>
                </Flex>
                <i className={ ((displayMode === NavigatorSearchResultViewDisplayMode.LIST) ? 'icon icon-nav-thumbnail' : (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS) ? 'icon icon-nav-inline' : null) } onClick={ toggleDisplayMode } />
            </Flex> { isExtended &&
                <>
                    {
                        gridHasTwoColumns ? <AutoGrid columnCount={ 3 } { ...rest } columnMinWidth={ 110 } columnMinHeight={ 130 } className="mx-2">
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } thumbnail={ true } />) }
                        </AutoGrid> : <Grid columnCount={ 1 } className="navigator-grid" gap={ 0 }>
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } />) }
                        </Grid>
                    }
                </>
            }
        </Column>
    );
}
