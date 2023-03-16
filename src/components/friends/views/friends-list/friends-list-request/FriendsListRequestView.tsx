import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, Flex, NitroCardAccordionSetView, NitroCardAccordionSetViewProps } from '../../../../../common';
import { useFriends } from '../../../../../hooks';
import { FriendsListRequestItemView } from './FriendsListRequestItemView';

export const FriendsListRequestView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { requests = [], requestResponse = null } = useFriends();

    if(!requests.length) return null;

    return (
        <NitroCardAccordionSetView { ...rest }>
            <Column fullHeight justifyContent="between" gap={ 1 }>
                <Column gap={ 0 }>
                    { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request }/>) }
                </Column>
            </Column>
            <Column className="requests-active-tab" gap={ 0 }>
                <Button justifyContent="start" className="volter-button" onClick={ event => requestResponse(-1, true) }>
                    <i className="nitro-friends-spritesheet icon-accept accept-button"/>
                    { LocalizeText('friendlist.requests.acceptall') }
                </Button>
                <Button justifyContent="start" className="volter-button button-margin" onClick={ event => requestResponse(-1, false) }>
                    <i className="nitro-friends-spritesheet icon-deny decline-button"/>
                    { LocalizeText('friendlist.requests.dismissall') }
                </Button>
            </Column>
            { children }
        </NitroCardAccordionSetView>
    );
}
