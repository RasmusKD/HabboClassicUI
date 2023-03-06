import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GroupDeleteComposer, GroupSaveInformationComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, IGroupData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, Text } from '../../../../common';
import { useNotification } from '../../../../hooks';

interface GroupTabIdentityViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
    onClose: () => void;
    isCreator?: boolean;
    availableRooms?: { id: number, name: string }[];
}

export const GroupTabIdentityView: FC<GroupTabIdentityViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null, onClose = null, isCreator = false, availableRooms = [] } = props;
    const [ groupName, setGroupName ] = useState<string>('');
    const [ groupDescription, setGroupDescription ] = useState<string>('');
    const [ groupHomeroomId, setGroupHomeroomId ] = useState<number>(-1);
    const { showConfirm = null } = useNotification();

    const deleteGroup = () =>
    {
        if(!groupData || (groupData.groupId <= 0)) return;

        showConfirm(LocalizeText('group.deleteconfirm.desc'), () =>
        {
            SendMessageComposer(new GroupDeleteComposer(groupData.groupId));

            if(close) close();
        }, null, null, null, LocalizeText('group.deleteconfirm.title'));
    }

    const saveIdentity = useCallback(() =>
    {
        if(!groupData || !groupName || !groupName.length) return false;

        if((groupName === groupData.groupName) && (groupDescription === groupData.groupDescription)) return true;

        if(groupData.groupId <= 0)
        {
            if(groupHomeroomId <= 0) return false;

            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.groupName = groupName;
                newValue.groupDescription = groupDescription;
                newValue.groupHomeroomId = groupHomeroomId;

                return newValue;
            });

            return true;
        }

        SendMessageComposer(new GroupSaveInformationComposer(groupData.groupId, groupName, (groupDescription || '')));

        return true;
    }, [ groupData, groupName, groupDescription, groupHomeroomId, setGroupData ]);

    useEffect(() =>
    {
        setGroupName(groupData.groupName || '');
        setGroupDescription(groupData.groupDescription || '');
        setGroupHomeroomId(groupData.groupHomeroomId);
    }, [ groupData ]);

    useEffect(() =>
    {
        setCloseAction({ action: saveIdentity });

        return () => setCloseAction(null);
    }, [ setCloseAction, saveIdentity ]);

    if(!groupData) return null;

    return (
        <Column justifyContent="between" overflow="auto">
            <Column gap={ 1 }>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('group.edit.name') }</Text>
                    <input spellCheck="false" type="text" className="form-control form-control-sm squared-form" value={ groupName } maxLength={ 29 } onChange={ event => setGroupName(event.target.value) } />
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('group.edit.desc') }</Text>
                    <textarea spellCheck="false" className="form-control form-control-sm trophy-text squared-form" value={ groupDescription } maxLength={ 254 } onChange={ event => setGroupDescription(event.target.value) } />
                </Column>
                { isCreator &&
                    <>
                        <Column gap={ 1 }>
                            <Text bold>{ LocalizeText('group.edit.base') }</Text>
                            <Column fullWidth gap={ 1 }>
                                <select className="form-select form-select-sm select-width" value={ groupHomeroomId } onChange={ event => setGroupHomeroomId(parseInt(event.target.value)) }>
                                    <option value={ -1 } disabled>{ LocalizeText('group.edit.base.select.room') }</option>
                                    { availableRooms && availableRooms.map((room, index) => <option key={ index } value={ room.id }>{ room.name }</option>) }
                                </select>
                            </Column>
                        </Column>
                        <Flex gap={ 1 }>
                            <Base>&nbsp;</Base>
                            <Text italics small>{ LocalizeText('group.edit.base.warning') }</Text>
                        </Flex>
                    </> }
            </Column>
            { !isCreator &&
                <Text variant="danger" underline bold pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ deleteGroup }>
                    <FontAwesomeIcon icon="times" />
                    { LocalizeText('group.delete') }
                </Text> }
            { isCreator &&
                <Text underline center fullWidth pointer onClick={ event => CreateLinkEvent('navigator/create') }>{ LocalizeText('group.createroom') }</Text> }
        </Column>
    );
};
