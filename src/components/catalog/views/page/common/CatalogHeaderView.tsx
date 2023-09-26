import { FC } from 'react';
import { ICatalogNode } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export interface CatalogHeaderViewProps
{
    node: ICatalogNode;
}

export const CatalogHeaderView: FC<CatalogHeaderViewProps> = props =>
{
    const { node = null } = props;
    const { currentPage = null, activateNode = null, rootNode = null, getNodeById = null } = useCatalog();
  const imageUrl = currentPage && currentPage.localization.getImage(0)? currentPage.localization.getImage(0) : 'https://habboclassic.dk/swfs/c_images/catalogue/catalog_frontpage_Habboclassic.gif';

    return (
        <>
            <Flex className="catalog-header w-100">
                <Flex gap={ 2 }>
                    <Flex className="catalog-header-image justify-content-center">
                        <img draggable="false" src={imageUrl}></img>
                    </Flex>
                    <Flex className="catalog-header-desc py-2 mt-auto mb-auto">
                        <Text dangerouslySetInnerHTML={ { __html: currentPage && currentPage.localization.getText(0) } }/>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}
