import { CloseIssuesMessageComposer, ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetIssueCategoryName, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useModTools } from '../../../../hooks';
import { CfhChatlogView } from './CfhChatlogView';

interface IssueInfoViewProps
{
    issueId: number;
    onIssueInfoClosed(issueId: number): void;
}

export const ModToolsIssueInfoView: FC<IssueInfoViewProps> = props =>
{
    const { issueId = null, onIssueInfoClosed = null } = props;
    const [ cfhChatlogOpen, setcfhChatlogOpen ] = useState(false);
    const { tickets = [], openUserInfo = null } = useModTools();
    const ticket = tickets.find(issue => (issue.issueId === issueId));

    const releaseIssue = (issueId: number) =>
    {
        SendMessageComposer(new ReleaseIssuesMessageComposer([ issueId ]));

        onIssueInfoClosed(issueId);
    }

    const closeIssue = (resolutionType: number) =>
    {
        SendMessageComposer(new CloseIssuesMessageComposer([ issueId ], resolutionType));

        onIssueInfoClosed(issueId)
    }

    return (
        <>
            <NitroCardView className="nitro-mod-tools-handle-issue no-resize" theme="modtool-windows">
                <NitroCardHeaderView headerText={ 'Løser problem ' + issueId } onCloseClick={ () => onIssueInfoClosed(issueId) } />
                <NitroCardContentView className="text-black">
                    <Column className="mod-content p-2">
                    <Text gfbold>Sags Information</Text>
                    <Grid overflow="auto">
                        <Column size={ 8 }>
                            <table className="table table-striped table-sm table-text-small text-black m-0">
                                <tbody>
                                    <tr>
                                        <th>Kilde</th>
                                        <td>{ GetIssueCategoryName(ticket.categoryId) }</td>
                                    </tr>
                                    <tr>
                                        <th>Kategori</th>
                                        <td className="text-break">{ LocalizeText('help.cfh.topic.' + ticket.reportedCategoryId) }</td>
                                    </tr>
                                    <tr>
                                        <th>Beskrivelse</th>
                                        <td className="text-break">{ ticket.message }</td>
                                    </tr>
                                    <tr>
                                        <th>Anmelder</th>
                                        <td>
                                            <Text gfbold underline pointer onClick={ event => openUserInfo(ticket.reporterUserId) }>{ ticket.reporterUserName }</Text>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Rapporteret Bruger</th>
                                        <td>
                                            <Text gfbold underline pointer onClick={ event => openUserInfo(ticket.reportedUserId) }>{ ticket.reportedUserName }</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Column>
                        <Column size={ 4 } gap={ 1 }>
                            <Button className="volter-button" onClick={ () => setcfhChatlogOpen(!cfhChatlogOpen) }>Chatlog</Button>
                            <Button className="volter-button" onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_USELESS) }>Luk som ubrugelig</Button>
                            <Button className="volter-button" onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_ABUSIVE) }>Luk som misbrug</Button>
                            <Button className="volter-bold-button" onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_RESOLVED) }>Luk som løst</Button>
                            <Button className="volter-button" onClick={ event => releaseIssue(issueId) } >Frigiv</Button>
                        </Column>
                    </Grid>
                    </Column>
                </NitroCardContentView>
            </NitroCardView>
            { cfhChatlogOpen &&
                <CfhChatlogView issueId={ issueId } onCloseClick={ () => setcfhChatlogOpen(false) }/> }
        </>
    );
}
