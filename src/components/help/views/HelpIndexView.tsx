import { GetCfhStatusMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CreateLinkEvent, DispatchUiEvent, LocalizeText, ReportState, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';
import { GuideToolEvent } from '../../../events';
import { useHelp } from '../../../hooks';

export const HelpIndexView: FC<{}> = props =>
{
    const { setActiveReport = null } = useHelp();

    const onReportClick = () =>
    {
        setActiveReport(prevValue =>
        {
            const currentStep = ReportState.SELECT_USER;

            return { ...prevValue, currentStep };
        });
    }

    return (
        <>
            <Column grow center gap={ 1 }>
                <Text fontSize={ 3 }>{ LocalizeText('help.main.frame.title') }</Text>
                <Text>{ LocalizeText('help.main.self.description') }</Text>
            </Column>
            <Column gap={ 1 }>
                <Button variant="success" onClick={ onReportClick }>{ LocalizeText('help.main.bully.subtitle') }</Button>
                <Button variant="success" onClick={ () => CreateLinkEvent('habbopages/help') }>{ LocalizeText('Habboclassic.dk.help') }</Button>
                <Button variant="success" onClick={ () => CreateLinkEvent('habbopages/rules') }>{ LocalizeText('Habboclassic.dk.rules') }</Button>
                <Button variant="discord" onClick={ event => window.open('https://discord.com/invite/habboclassic') }>{ LocalizeText('help.main.help.title') }</Button>
            </Column>
            <Button variant="link" textColor="black" onClick={ () => SendMessageComposer(new GetCfhStatusMessageComposer(false)) }>{ LocalizeText('help.main.my.sanction.status') }</Button>
        </>
    )
}
