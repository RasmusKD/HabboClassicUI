import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Base, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useRoom } from '../../hooks';

export const BackgroundsView: FC = () => 
{
    const [ isVisible, setIsVisible ] = useState(false);

    const backgroundIds: number[] = Array.from({ length: 11 }, (_, index) => index);
    const { roomSession = null } = useRoom();

    useEffect(() => 
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => 
            {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1]) 
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'backgrounds/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if (!isVisible) return null;

    return (
        <NitroCardView uniqueKey="backgrounds" className="nitro-backgrounds no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('infostand.backgrounds') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView gap={ 1 }>
                <Text bold center>Vælg en baggrund</Text>
                <Grid gap={ 1 } columnCount={ 5 } overflow="auto">
                    { backgroundIds.map(backgroundId => (
                        <Flex center pointer key={ backgroundId } onClick={ (event) => roomSession.sendBackgroundMessage(backgroundId) }>
                            <Base key={ backgroundId }>
                                <Base className={ `profile-background background-${ backgroundId }` }></Base>
                            </Base>
                        </Flex>
                    )) }
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
