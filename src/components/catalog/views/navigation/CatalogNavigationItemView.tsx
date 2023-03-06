import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { ICatalogNode } from '../../../../api';
import { LayoutGridItem, Text, Base } from '../../../../common';
import { useCatalog } from '../../../../hooks';
import { CatalogIconView } from '../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationItemViewProps
{
    node: ICatalogNode;
    child?: boolean;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { node = null, child = false } = props;
    const { activateNode = null } = useCatalog();

    return (
        <>
            <LayoutGridItem style={ { paddingLeft: `${ (node.depth -2) * 10 }px` } } gap={ 1 } column={ false } itemActive={ node.isActive } onClick={ event => activateNode(node) } className={ child ? 'inset' : '' }>
            <CatalogIconView icon={ node.iconId } />
                { (node.depth <= 2) &&
                <Text grow truncate>{ node.localization }</Text>}
                { (node.depth > 2) &&
                <Text grow truncate className={ node.isActive === false ? 'nitro-catalog-navigation-grid-container2' : 'nitro-catalog-navigation-grid-container3' }>{ node.localization }</Text>}
                { node.isBranch &&
                    <Base pointer className={ node.isOpen ? 'caret-down' : 'caret-up' } /> }
            </LayoutGridItem>
            { node.isOpen && node.isBranch &&
                <CatalogNavigationSetView node={ node } child={ true } /> }
        </>
    );
}
