import { CallForHelpTopicData, DefaultSanctionMessageComposer, ModAlertMessageComposer, ModBanMessageComposer, ModKickMessageComposer, ModMessageMessageComposer, ModMuteMessageComposer, ModTradingLockMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { ISelectedUser, LocalizeText, ModActionDefinition, NotificationAlertType, SendMessageComposer } from '../../../../api';
import { Button, Column, DraggableWindowPosition, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useModTools, useNotification } from '../../../../hooks';

interface ModToolsUserModActionViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

const MOD_ACTION_DEFINITIONS = [
    new ModActionDefinition(1, 'Advarsel', ModActionDefinition.ALERT, 1, 0),
    new ModActionDefinition(2, 'Mute 1t', ModActionDefinition.MUTE, 2, 0),
    new ModActionDefinition(3, 'Ban 18t', ModActionDefinition.BAN, 3, 0),
    new ModActionDefinition(4, 'Ban 7 dage', ModActionDefinition.BAN, 4, 0),
    new ModActionDefinition(5, 'Ban 30 dage (trin 1)', ModActionDefinition.BAN, 5, 0),
    new ModActionDefinition(7, 'Ban 30 dage (trin 2)', ModActionDefinition.BAN, 7, 0),
    new ModActionDefinition(6, 'Ban 100 år', ModActionDefinition.BAN, 6, 0),
    new ModActionDefinition(106, 'Ban kun-bruger 100 år', ModActionDefinition.BAN, 6, 0),
    new ModActionDefinition(101, 'Smid ud', ModActionDefinition.KICK, 0, 0),
    new ModActionDefinition(102, 'Byttelås 1 uge', ModActionDefinition.TRADE_LOCK, 0, 168),
    new ModActionDefinition(104, 'Byttelås permanent', ModActionDefinition.TRADE_LOCK, 0, 876000),
    new ModActionDefinition(105, 'Besked', ModActionDefinition.MESSAGE, 0, 0),
];

export const ModToolsUserModActionView: FC<ModToolsUserModActionViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;
    const [ selectedTopic, setSelectedTopic ] = useState(-1);
    const [ selectedAction, setSelectedAction ] = useState(-1);
    const [ message, setMessage ] = useState<string>('');
    const { cfhCategories = null, settings = null } = useModTools();
    const { simpleAlert = null } = useNotification();
    const [isSelectedActionOpen, setIsSelectedActionOpen] = useState(false);
    const [isSelectedTopicOpen, setIsSelectedTopicOpen] = useState(false);

    const handleSelectToggle = (selectName) => {
        switch (selectName) {
            case 'SelectedAction':
                setIsSelectedActionOpen(!isSelectedActionOpen);
                break;
            case 'SelectedTopic':
                setIsSelectedTopicOpen(!isSelectedTopicOpen);
                break;
            default:
                break;
        }
    };

    const topics = useMemo(() =>
    {
        const values: CallForHelpTopicData[] = [];

        if(cfhCategories && cfhCategories.length)
        {
            for(const category of cfhCategories)
            {
                for(const topic of category.topics) values.push(topic);
            }
        }

        return values;
    }, [ cfhCategories ]);

    const sendAlert = (message: string) => simpleAlert(message, NotificationAlertType.DEFAULT, null, null, 'Error');

    const sendDefaultSanction = () =>
    {
        let errorMessage: string = null;

        const category = topics[selectedTopic];

        if(selectedTopic === -1) errorMessage = 'You must select a CFH topic';

        if(errorMessage) return sendAlert(errorMessage);

        const messageOrDefault = (message.trim().length === 0) ? LocalizeText(`help.cfh.topic.${ category.id }`) : message;

        SendMessageComposer(new DefaultSanctionMessageComposer(user.userId, selectedTopic, messageOrDefault));

        onCloseClick();
    }

    const sendSanction = () =>
    {
        let errorMessage: string = null;

        const category = topics[selectedTopic];
        const sanction = MOD_ACTION_DEFINITIONS[selectedAction];

        if((selectedTopic === -1) || (selectedAction === -1)) errorMessage = 'You must select a CFH topic and Sanction';
        else if(!settings || !settings.cfhPermission) errorMessage = 'You do not have permission to do this';
        else if(!category) errorMessage = 'You must select a CFH topic';
        else if(!sanction) errorMessage = 'You must select a sanction';

        if(errorMessage)
        {
            sendAlert(errorMessage);

            return;
        }

        const messageOrDefault = (message.trim().length === 0) ? LocalizeText(`help.cfh.topic.${ category.id }`) : message;

        switch(sanction.actionType)
        {
            case ModActionDefinition.ALERT: {
                if(!settings.alertPermission)
                {
                    sendAlert('You have insufficient permissions');

                    return;
                }

                SendMessageComposer(new ModAlertMessageComposer(user.userId, messageOrDefault, category.id));
                break;
            }
            case ModActionDefinition.MUTE:
                SendMessageComposer(new ModMuteMessageComposer(user.userId, messageOrDefault, category.id));
                break;
            case ModActionDefinition.BAN: {
                if(!settings.banPermission)
                {
                    sendAlert('You have insufficient permissions');

                    return;
                }

                SendMessageComposer(new ModBanMessageComposer(user.userId, messageOrDefault, category.id, selectedAction, (sanction.actionId === 106)));
                break;
            }
            case ModActionDefinition.KICK: {
                if(!settings.kickPermission)
                {
                    sendAlert('You have insufficient permissions');
                    return;
                }

                SendMessageComposer(new ModKickMessageComposer(user.userId, messageOrDefault, category.id));
                break;
            }
            case ModActionDefinition.TRADE_LOCK: {
                const numSeconds = (sanction.actionLengthHours * 60);

                SendMessageComposer(new ModTradingLockMessageComposer(user.userId, messageOrDefault, numSeconds, category.id));
                break;
            }
            case ModActionDefinition.MESSAGE: {
                if(message.trim().length === 0)
                {
                    sendAlert('Please write a message to user');

                    return;
                }

                SendMessageComposer(new ModMessageMessageComposer(user.userId, message, category.id));
                break;
            }
        }

        onCloseClick();
    }

    if(!user) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-action friendbars something3" overflow="visible" theme="modtool-windows" windowPosition={ DraggableWindowPosition.TOP_CENTER }>
            <NitroCardHeaderView headerText={ 'Mod Action: ' + (user ? user.username : '') } onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Column className="actions-dropdown-height">
                <div className={`modcustomSelect ${isSelectedTopicOpen ? 'active' : ''}`} onClick={() => handleSelectToggle('SelectedTopic')} onBlur={() => setIsSelectedTopicOpen(false)} tabIndex={0}>
                    <div className="selectButton">{selectedTopic !== -1 ? LocalizeText('help.cfh.topic.' + topics[selectedTopic]?.id) : 'CFH Emne'}</div>
                    <div className="options"> {topics.map((topic, index) => ( <div key={index} value={index} className={`option ${isSelectedTopicOpen && index === selectedTopic ? 'selected' : ''}`} onClick={() => setSelectedTopic(index)}> {LocalizeText('help.cfh.topic.' + topic.id)} </div> ))} </div>
                </div>
                <div className={`actions-dropdown-placement modcustomSelect ${isSelectedActionOpen ? 'active' : ''}`} onClick={() => handleSelectToggle('SelectedAction')} onBlur={() => setIsSelectedActionOpen(false)} tabIndex={0}>
                    <div className="selectButton">{MOD_ACTION_DEFINITIONS[selectedAction]?.name || 'Sanktionstype'}</div>
                    <div className="options"> {MOD_ACTION_DEFINITIONS.map((action, index) => ( <div key={index} value={index} className={`option ${isSelectedActionOpen && index === selectedAction ? 'selected' : ''}`} onClick={() => setSelectedAction(index)}> {action.name} </div> ))} </div>
                </div>
                </Column>
                <Column gap={ 1 }>
                    <Text variant="white">Valgfri besked, overskriver standard</Text>
                    <textarea spellCheck="false" className="form-control" value={ message } onChange={ event => setMessage(event.target.value) }/>
                </Column>
                <Flex justifyContent="between" gap={ 1 }>
                    <Button variant="primary" onClick={ sendDefaultSanction }>Standardsanktion</Button>
                    <Button variant="success" onClick={ sendSanction }>Sanktion</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
