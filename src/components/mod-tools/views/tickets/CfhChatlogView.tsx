import { CfhChatlogData, CfhChatlogEvent, GetCfhChatlogMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { Column, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';
import { ChatlogView } from '../chatlog/ChatlogView';

interface CfhChatlogViewProps
{
    issueId: number;
    onCloseClick(): void;
}

export const CfhChatlogView: FC<CfhChatlogViewProps> = props =>
{
    const { onCloseClick = null, issueId = null } = props;
    const [ chatlogData, setChatlogData ] = useState<CfhChatlogData>(null);

    useMessageEvent<CfhChatlogEvent>(CfhChatlogEvent, event =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.issueId !== issueId) return;

        setChatlogData(parser.data);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetCfhChatlogMessageComposer(issueId));
    }, [ issueId ]);

    return (
        <NitroCardView className="nitro-mod-tools-chatlog no-resize" theme="modtool-windows">
            <NitroCardHeaderView headerText={ 'Sag Chatlog' } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
            <Column className="mod-content p-2">
                { chatlogData && <ChatlogView records={ [ chatlogData.chatRecord ] } /> }
            </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
