import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, RemoveLinkEventTracker, AddEventLinkTracker } from '../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
const TABS: number[] = [ 1, 2, 3, 4 ];

export const WiredHelpView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ currentTab, setCurrentTab ] = useState<number>(1);

    const previousStep = () =>
        {
            setCurrentTab(value => value - 1);
        }

        const nextStep = () =>
        {
            setCurrentTab(value => (value === 4 ? value : value + 1));
        }
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
                                        case 'wiredhelp':
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

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-wired-help" theme="wired">
            <NitroCardHeaderView headerText={ LocalizeText('wiredfurni.help.title') } onCloseClick={ () => setIsVisible(false) } />
                <NitroCardContentView>
                <Column overflow="hidden">
                    <Column gap={ 1 }>
                        { (currentTab === 1) &&
                        <Column>
                            <Text gfbold variant="white"> { LocalizeText('wiredfurni.help.1.text') } </Text>
                            <i className="wired-help-image1" />
                        </Column> }
                        { (currentTab === 2) &&
                        <Column>
                            <Text gfbold variant="white"> { LocalizeText('wiredfurni.help.2.text') } </Text>
                            <i className="wired-help-image2" />
                        </Column> }
                        { (currentTab === 3) &&
                        <Column>
                            <Text gfbold variant="white"> { LocalizeText('wiredfurni.help.3.text') } </Text>
                            <i className="wired-help-image3" />
                        </Column> }
                        { (currentTab === 4) &&
                        <Column>
                            <Text gfbold variant="white"> { LocalizeText('wiredfurni.help.4.text') } </Text>
                            <i className="wired-help-image4" />
                        </Column> }
                    </Column>
                    <Flex justifyContent="between">
                        <Button disabled={ ((currentTab === 1)) } className="notification-buttons help-button-size" onClick={ previousStep }>
                            <i className="icon button-prev"/>
                        </Button>
                        <Button disabled={ ((currentTab === 4)) } className="notification-buttons help-button-size" onClick={ nextStep }>
                            <i className="icon button-next"/>
                        </Button>
                    </Flex>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
