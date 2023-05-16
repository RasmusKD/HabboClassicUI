import { GroupDeleteComposer, GroupSaveInformationComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
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
    const [ isOpen, setIsOpen ] = useState(false);
    const dropdownRef = useRef(null);

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = availableRooms ? Math.ceil(availableRooms.length / itemsPerPage) : 0;

    const handlePrevPage = (event) => {
        event.stopPropagation();
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = (event) => {
        event.stopPropagation();
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    function handleSelectClick() {
        setIsOpen(!isOpen);
    }

    function handleSelectBlur() {
        setIsOpen(false);
    }

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

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

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
                                <div className={`groupcustomSelect ${isOpen ? 'active' : ''}`} ref={dropdownRef} onClick={handleSelectClick} tabIndex={0}>
                                    <div className="selectButton">
                                        {groupHomeroomId === -1
                                            ? LocalizeText('group.edit.base.select.room')
                                            : availableRooms && availableRooms.find(room => room.id === groupHomeroomId)?.name
                                        }
                                    </div>
                                    <div className="options">
                                       {Array.from({ length: itemsPerPage }).map((_, index) => {
                                           const room = availableRooms && availableRooms.length > 0 && availableRooms
                                               .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)[index];

                                           return room ? (
                                               <div
                                                   key={index}
                                                   value={room.id}
                                                   className={`option ${isOpen && room.id === groupHomeroomId ? 'selected' : ''}`}
                                                   onClick={() => setGroupHomeroomId(room.id)}>
                                                   {room.name}
                                               </div>
                                           ) : (
                                               <div key={index} className="placeholder-option"></div>
                                           );
                                       })}
                                        {availableRooms && availableRooms.length > itemsPerPage &&
                                            <Flex className="select-room-padding">
                                                <Base className={`w-100 select-next-prev-button ${currentPage === 0 ? 'disabled' : ''}`}  onClick={handlePrevPage} disabled={currentPage === 0}>
                                                    Forrige
                                                </Base>
                                                <Text className="w-100 group-select-text" bold>{`Side ${currentPage + 1}/${totalPages}`}</Text>
                                                <Base className={`w-100 select-next-prev-button ${currentPage === totalPages - 1 ? 'disabled' : ''}`} onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                                                    Næste
                                                </Base>
                                            </Flex>}
                                    </div>
                                </div>
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
                    <FaTimes className="fa-icon" />
                    { LocalizeText('group.delete') }
                </Text> }
            { isCreator &&
                <Text underline center fullWidth pointer onClick={ event => CreateLinkEvent('navigator/create') }>{ LocalizeText('group.createroom') }</Text> }
        </Column>
    );
};
