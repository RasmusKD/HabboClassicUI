import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useSessionInfo } from '../../hooks';

export const HcCenterView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { userFigure = null } = useSessionInfo();;

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'open':
                        if(parts.length > 2)
                        {
                            switch(parts[2])
                            {
                                case 'hccenter':
                                    setIsVisible(true);
                                    break;
                            }
                        }
                        return;
                }
            },
            eventUrlPrefix: 'habboUI/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        if(!isVisible) return;

    }, [ isVisible ]);

    if(!isVisible) return null;

    return (
        <NitroCardView theme="primary" className="nitro-hc-center">
            <NitroCardHeaderView headerText={ LocalizeText('habboclassic.store') } onCloseClick={ () => setIsVisible(false) } />
            <Base position="absolute" className="nitro-card-header-help" onClick={ () => CreateLinkEvent('habbopages/habboclub') }/>
            <Flex position="relative" className="bg-muted p-2 hc-logo">
                <Column gap={ 1 } justifyContent="center" className="px-2 ms-auto mx-auto header-content">
                    <Column gap={ 0 } className="mt-5">
                        <Text center bold fontSize={ 5 } variant="white" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.title') } }/>
                        <Text small center variant="white" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.desc') } }/>
                    </Column>
                </Column>
                <Base position="absolute" className="end-0 p-4 top-3 habbo-avatar">
                    <LayoutAvatarImageView figure={ userFigure } direction={ 4 } scale={ 2 } />
                </Base>
            </Flex>
            <NitroCardContentView>
                <Flex fullWidth alignItems="center" gap={ 2 }>
                    <Column fullWidth gap={ 1 } className="p-2 payday-special store-info mb-1 ml-1 position-relative">
                        <Text small variant="white" className="mt-2" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.info') } }/>
                        <Flex className="position-absolute end-1 bottom-1">
                            <Button variant="success" onClick={ event => window.open('https://habboclassic.dk/store') }>
                                { LocalizeText('Gå til butikken!') }
                            </Button>
                        </Flex>
                    </Column>
                    <Column fullWidth gap={ 2 } className="p-2 payday-special store-info mb-1 ml-1">
                        <Text small variant="white" className="mt-2" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.refunds.info') } }/>
                    </Column>
                </Flex>
                <Flex fullWidth alignItems="center" className="center-part">
                    <Column gap={ 0 } className="p-2 payday-special blue-bubble left mb-1 ml-1">
                        <Text bold fontSize={ 5 } variant="white" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.vip.title') } }/>
                        <Text small variant="white" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.vip.info') } }/>
                    </Column>
                    <Column gap={ 0 } className="avatar-left position-absolute">
                        <Text center variant="danger" className="left-bubble" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.vip.features.title') } }/>
                        <Text center small className="left-bubble content" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.vip.features.info') } } />
                        <i className="coin-icon position-absolute bottom-2" />
                    </Column>
                    <Column gap={ 0 } className="avatar-right position-absolute">
                        <Text center variant="danger" className="right-bubble" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.clubhabboclassic.features.title') } }/>
                        <Text small center className="right-bubble content" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.clubhabboclassic.features.info') } } />
                        <i className="hc-icon position-absolute" />
                    </Column>
                    <Column gap={ 0 } className="p-2 payday-special blue-bubble right ms-auto mb-1 ml-1">
                        <Text bold fontSize={ 5 } variant="white" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.clubhabboclassic.title') } }/>
                        <Text small variant="white" dangerouslySetInnerHTML={ { __html: LocalizeText('habboclassic.store.clubhabboclassic.info') } }/>
                        <Text variant="white" small bold underline className="cursor-pointer" onClick={ () => CreateLinkEvent('catalog/open/hc_membership') }>Bliv medlem af Habbo Club</Text>
                    </Column>
                </Flex>
                <Column className="benefits position-absolute"/>
            </NitroCardContentView>
        </NitroCardView>
    );
}
