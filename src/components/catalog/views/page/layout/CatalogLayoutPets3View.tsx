import { FC } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutPets3View: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    const imageUrl = page.localization.getImage(1);

    return (
    <Column className="pets-padding">
        <Column grow className="bg-pets pets-rounded text-white">
            <Flex alignItems="center" gap={ 2 }>
                { imageUrl && <img draggable="false" alt="" src={ imageUrl } /> }
                <Base className="pets-headline" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            </Flex>
            <Column grow alignItems="center">
                <Base className="pets-text" dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
            </Column>
            <Flex alignItems="center">
                <Base className="fw-bold" dangerouslySetInnerHTML={ { __html: page.localization.getText(3) } } />
            </Flex>
        </Column>
        </Column>
    );
}
