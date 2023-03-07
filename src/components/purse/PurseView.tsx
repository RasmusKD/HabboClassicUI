import { FriendlyTime, HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { CreateLinkEvent, GetConfiguration, LocalizeText, VisitDesktop } from '../../api';
import { Column, Flex, LayoutCurrencyIcon, Text, Tooltip } from '../../common';
import { usePurse } from '../../hooks';
import { CurrencyView } from './views/CurrencyView';
import { SeasonalView } from './views/SeasonalView';

export const PurseView: FC<{}> = props =>
{
    const { purse = null, hcDisabled = false } = usePurse();
    const displayedCurrencies = useMemo(() => GetConfiguration<number[]>('system.currency.types', []), []);
    const currencyDisplayNumberShort = useMemo(() => GetConfiguration<boolean>('currency.display.number.short', false), []);

    const getClubText = (() =>
    {
        if(!purse) return null;

        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays);
        const minutesUntilExpiration = purse.minutesUntilExpiration;

        if(purse.clubLevel === HabboClubLevelEnum.NO_CLUB) return LocalizeText('purse.clubdays.zero.amount.text');

        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24))) return FriendlyTime.shortFormat(minutesUntilExpiration * 60);

        else return FriendlyTime.shortFormat(totalDays * 86400);
    })();

    const getCurrencyElements = (offset: number, limit: number = -1, seasonal: boolean = false) =>
    {
        if(!purse || !purse.activityPoints || !purse.activityPoints.size) return null;

        const types = Array.from(purse.activityPoints.keys()).filter(type => (displayedCurrencies.indexOf(type) >= 0));

        let count = 0;

        while(count < offset)
        {
            types.shift();

            count++;
        }

        count = 0;

        const elements: JSX.Element[] = [];

        for(const type of types)
        {
            if((limit > -1) && (count === limit)) break;

            if(seasonal) elements.push(<SeasonalView key={ type } type={ type } amount={ purse.activityPoints.get(type) } />);
            else elements.push(<CurrencyView key={ type } type={ type } amount={ purse.activityPoints.get(type) } short={ currencyDisplayNumberShort } />);

            count++;
        }

        return elements;
    }

    if(!purse) return null;

    return (
        <Column className="nitro-purse-container" gap={ 1 }>
            <Column gap={ 0 } className="nitro-purse">
                <Flex fullWidth>
                    <Tooltip content="Mønter"><Flex className="nitro-notification nitro-purse-box position-relative" onClick={ event => CreateLinkEvent('catalog/toggle') }>
                        <CurrencyView type={ -1 } amount={ purse.credits } short={ currencyDisplayNumberShort } />
                        <Flex className="nitro-purse-box-container coin position-absolute">
                            <LayoutCurrencyIcon pointer className="club-text" type={ -1 } />
                        </Flex>
                    </Flex></Tooltip>
                    <Tooltip tooltipWidth={39} content="Pixels"><Flex className="nitro-notification nitro-purse-box position-relative" onClick={ event => CreateLinkEvent('catalog/toggle') }>
                        { getCurrencyElements(0,1) }
                        <Flex className="nitro-purse-box-container pixel position-absolute">
                            <LayoutCurrencyIcon pointer className="club-text" type={ 0 } />
                        </Flex>
                    </Flex></Tooltip>
                </Flex>
                <Flex>
                    { !hcDisabled &&
                        <Tooltip content="Habbo Club"><Flex className="nitro-notification nitro-purse-box position-relative" onClick={ event => CreateLinkEvent('habboUI/open/hccenter') }>
                            <Text fullWidth pointer className="mt-auto mb-auto club-text nitro-purse-amount" bold truncate textEnd>{ getClubText }</Text>
                            <Flex className="nitro-purse-box-container hc position-absolute">
                                <LayoutCurrencyIcon pointer className="club-text" type="hc" />
                            </Flex>
                        </Flex></Tooltip> }
                    <Tooltip tooltipWidth={63} content="Diamanter"><Flex className="nitro-notification nitro-purse-box position-relative" onClick={ event => CreateLinkEvent('catalog/toggle') }>
                        <CurrencyView type={ 5 } amount={ purse.activityPoints.get(5) } short={ currencyDisplayNumberShort } />
                        <Flex className="nitro-purse-box-container diamond position-absolute">
                            <LayoutCurrencyIcon pointer className="club-text" type={ 5 } />
                        </Flex>
                    </Flex></Tooltip>
                </Flex>
                <Flex fullWidth gap={ 1 } className="nitro-notification nitro-purse-box align-items-center justify-content-center">
                    <Tooltip content="Hjælp"><Flex center pointer className="nitro-purse-right-button help p-1" onClick={ event => CreateLinkEvent('help/toggle') }>
                        <Text small>{ LocalizeText('help.button.cfh') }</Text>
                    </Flex></Tooltip>
                    <Tooltip tooltipWidth={70} content="Indstillinger"><Flex center pointer className="nitro-purse-right-button settings p-1" onClick={ event => CreateLinkEvent('user-settings/toggle') } >
                        <i className="icon icon-purse-settings"/>
                    </Flex></Tooltip>
                    <Tooltip tooltipWidth={119} content="Gå til hoteloversigten"><Flex center pointer className="nitro-purse-right-button disconnect p-1" onClick={ event => VisitDesktop() }>
                        <i className="icon icon-purse-disconnect"/>
                    </Flex></Tooltip>
                </Flex>
            </Column>
            { getCurrencyElements(2, -1, true) }
        </Column>
    );
}
