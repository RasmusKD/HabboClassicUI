import { RoomEngineObjectEvent, RoomEngineUseProductEvent, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomSessionPetInfoUpdateEvent, RoomSessionPetStatusUpdateEvent, RoomSessionUserDataUpdateEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { AvatarInfoFurni, AvatarInfoName, AvatarInfoPet, AvatarInfoRentableBot, AvatarInfoUser, AvatarInfoUtilities, CanManipulateFurniture, FurniCategory, GetRoomEngine, GetSessionDataManager, IAvatarInfo, IsOwnerOfFurniture, RoomWidgetUpdateRoomObjectEvent, UseProductItem } from '../../../api';
import { useNitroEvent, useUiEvent } from '../../events';
import { useFriends } from '../../friends';
import { useWired } from '../../wired';
import { useObjectDeselectedEvent, useObjectRollOutEvent, useObjectRollOverEvent, useObjectSelectedEvent } from '../engine';
import { useRoom } from '../useRoom';

const useAvatarInfoWidgetState = () =>
{
    const [ avatarInfo, setAvatarInfo ] = useState<IAvatarInfo>(null);
    const [ activeNameBubble, setActiveNameBubble ] = useState<AvatarInfoName>(null);
    const [ nameBubbles, setNameBubbles ] = useState<AvatarInfoName[]>([]);
    const [ productBubbles, setProductBubbles ] = useState<UseProductItem[]>([]);
    const [ confirmingProduct, setConfirmingProduct ] = useState<UseProductItem>(null);
    const [ pendingPetId, setPendingPetId ] = useState<number>(-1);
    const [ isDecorating, setIsDecorating ] = useState(false);
    const { friends = [] } = useFriends();
    const { selectObjectForWired = null } = useWired();
    const { roomSession = null } = useRoom();

    const removeNameBubble = (index: number) =>
    {
        setNameBubbles(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue.splice(index, 1);

            return newValue;
        });
    }

    const removeProductBubble = (index: number) =>
    {
        setProductBubbles(prevValue =>
        {
            const newValue = [ ...prevValue ];
            const item = newValue.splice(index, 1)[0];

            if(confirmingProduct === item) setConfirmingProduct(null);

            return newValue;
        });
    }

    const updateConfirmingProduct = (product: UseProductItem) =>
    {
        setConfirmingProduct(product);
        setProductBubbles([]);
    }

    const getObjectName = (objectId: number, category: number) =>
    {
        const name = AvatarInfoUtilities.getObjectName(objectId, category);

        if(!name) return;

        setActiveNameBubble(name);

        if(category !== RoomObjectCategory.UNIT) setProductBubbles([]);
    }

    const getObjectInfo = (objectId: number, category: number) =>
    {
        let info: IAvatarInfo = null;

        switch(category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                info = AvatarInfoUtilities.getFurniInfo(objectId, category);

                if(info) selectObjectForWired(objectId, category);
                break;
            case RoomObjectCategory.UNIT: {
                const userData = roomSession.userDataManager.getUserDataByIndex(objectId);

                if(!userData) break;

                switch(userData.type)
                {
                    case RoomObjectType.PET:
                        roomSession.userDataManager.requestPetInfo(userData.webID);
                        setPendingPetId(userData.webID);
                        break;
                    case RoomObjectType.USER:
                        info = AvatarInfoUtilities.getUserInfo(category, userData);
                        break;
                    case RoomObjectType.BOT:
                        info = AvatarInfoUtilities.getBotInfo(category, userData);
                        break;
                    case RoomObjectType.RENTABLE_BOT:
                        info = AvatarInfoUtilities.getRentableBotInfo(category, userData);
                        break;
                }
            }

        }

        if(!info) return;

        setAvatarInfo(info);
    }

    const processUsableRoomObject = (objectId: number) =>
    {
    }

    const refreshPetInfo = () =>
    {
        // roomSession.userDataManager.requestPetInfo(petData.id);
    }

    useNitroEvent<RoomSessionUserDataUpdateEvent>(RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED, event =>
    {
        if(!event.addedUsers.length) return;

        let addedNameBubbles: AvatarInfoName[] = [];

        event.addedUsers.forEach(user =>
        {
            if(user.webID === GetSessionDataManager().userId) return;

            if(friends.find(friend => (friend.id === user.webID)))
            {
                addedNameBubbles.push(new AvatarInfoName(user.roomIndex, RoomObjectCategory.UNIT, user.webID, user.name, user.type, true));
            }
        });

        if(!addedNameBubbles.length) return;

        setNameBubbles(prevValue =>
        {
            const newValue = [ ...prevValue ];

            addedNameBubbles.forEach(bubble =>
            {
                const oldIndex = newValue.findIndex(oldBubble => (oldBubble.id === bubble.id));

                if(oldIndex > -1) newValue.splice(oldIndex, 1);

                newValue.push(bubble);
            });

            return newValue;
        });
    });

    useNitroEvent<RoomSessionPetInfoUpdateEvent>(RoomSessionPetInfoUpdateEvent.PET_INFO, event =>
    {
        const petData = event.petInfo;

        if(!petData) return;

        if(petData.id !== pendingPetId) return;

        const petInfo = AvatarInfoUtilities.getPetInfo(petData);

        if(!petInfo) return;

        setAvatarInfo(petInfo);
        setPendingPetId(-1);
    });

    useNitroEvent<RoomSessionPetStatusUpdateEvent>(RoomSessionPetStatusUpdateEvent.PET_STATUS_UPDATE, event =>
    {
    });

    useNitroEvent<RoomEngineUseProductEvent>(RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY, event =>
    {
    });

    useNitroEvent<RoomEngineUseProductEvent>(RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, RoomObjectCategory.FLOOR);

        if(!roomObject || !IsOwnerOfFurniture(roomObject)) return;

        const ownerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
        const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
        const furniData = GetSessionDataManager().getFloorItemData(typeId);
        const parts = furniData.customParams.split(' ');
        const part = (parts.length ? parseInt(parts[0]) : -1);

        if(part === -1) return;

        const useProductBubbles: UseProductItem[] = [];
        const roomObjects = GetRoomEngine().getRoomObjects(roomSession.roomId, RoomObjectCategory.UNIT);

        for(const roomObject of roomObjects)
        {
            const userData = roomSession.userDataManager.getUserDataByIndex(roomObject.id);

            let replace = false;

            if(!userData || (userData.type !== RoomObjectType.PET))
            {

            }
            else
            {
                if(userData.ownerId === ownerId)
                {
                    if(userData.hasSaddle && (furniData.specialType === FurniCategory.PET_SADDLE)) replace = true;

                    const figureParts = userData.figure.split(' ');
                    const figurePart = (figureParts.length ? parseInt(figureParts[0]) : -1);

                    if(figurePart === part)
                    {
                        if(furniData.specialType === FurniCategory.MONSTERPLANT_REVIVAL)
                        {
                            if(!userData.canRevive) continue;
                        }

                        if(furniData.specialType === FurniCategory.MONSTERPLANT_REBREED)
                        {
                            if((userData.petLevel < 7) || userData.canRevive || userData.canBreed) continue;
                        }

                        if(furniData.specialType === FurniCategory.MONSTERPLANT_FERTILIZE)
                        {
                            if((userData.petLevel >= 7) || userData.canRevive) continue;
                        }

                        useProductBubbles.push(new UseProductItem(userData.roomIndex, RoomObjectCategory.UNIT, userData.name, event.objectId, roomObject.id, -1, replace));
                    }
                }
            }
        }

        setConfirmingProduct(null);

        if(useProductBubbles.length) setProductBubbles(useProductBubbles);
    });

    useNitroEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.REQUEST_MANIPULATION, event =>
    {
        if(!CanManipulateFurniture(roomSession, event.objectId, event.category)) return;

        setIsDecorating(true);
    });

    useObjectSelectedEvent(event =>
    {
        getObjectInfo(event.id, event.category);
    });

    useObjectDeselectedEvent(event =>
    {
        setAvatarInfo(null);
        setProductBubbles([]);
    });


    useObjectRollOverEvent(event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        if(avatarInfo instanceof AvatarInfoUser && avatarInfo.roomIndex === event.id) return;
        if(avatarInfo instanceof AvatarInfoRentableBot && avatarInfo.roomIndex === event.id) return;

        getObjectName(event.id, event.category);
    });



    useObjectRollOutEvent(event =>
    {
        if(!activeNameBubble || (event.category !== RoomObjectCategory.UNIT) || (activeNameBubble.roomIndex !== event.id)) return;

        setActiveNameBubble(null);
    });

    useUiEvent<RoomWidgetUpdateRoomObjectEvent>([
        RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED,
        RoomWidgetUpdateRoomObjectEvent.USER_REMOVED
    ], event =>
    {
        if(activeNameBubble && (activeNameBubble.category === event.category) && (activeNameBubble.roomIndex === event.id)) setActiveNameBubble(null);

        if(event.category === RoomObjectCategory.UNIT)
        {
            let index = nameBubbles.findIndex(bubble => (bubble.roomIndex === event.id));

            if(index > -1) setNameBubbles(prevValue => prevValue.filter(bubble => (bubble.roomIndex === event.id)));

            index = productBubbles.findIndex(bubble => (bubble.id === event.id));

            if(index > -1) setProductBubbles(prevValue => prevValue.filter(bubble => (bubble.id !== event.id)));
        }

        else if(event.category === RoomObjectCategory.FLOOR)
        {
            const index = productBubbles.findIndex(bubble => (bubble.id === event.id));

            if(index > -1) setProductBubbles(prevValue => prevValue.filter(bubble => (bubble.requestRoomObjectId !== event.id)));
        }

        if(avatarInfo)
        {
            if(avatarInfo instanceof AvatarInfoFurni)
            {
                if(avatarInfo.id === event.id) setAvatarInfo(null);
            }

            else if((avatarInfo instanceof AvatarInfoUser) || (avatarInfo instanceof AvatarInfoRentableBot) || (avatarInfo instanceof AvatarInfoPet))
            {
                if(avatarInfo.roomIndex === event.id) setAvatarInfo(null);
            }
        }
    });

    useEffect(() =>
    {
        if(!avatarInfo) return;

        setActiveNameBubble(null);
        setNameBubbles([]);
        setProductBubbles([]);
    }, [ avatarInfo ]);

    useEffect(() =>
    {
        if(!activeNameBubble) return;

        setNameBubbles([]);
    }, [ activeNameBubble ]);

    useEffect(() =>
    {
        roomSession.isDecorating = isDecorating;
    }, [ roomSession, isDecorating ]);

    return { avatarInfo, setAvatarInfo, activeNameBubble, setActiveNameBubble, nameBubbles, productBubbles, confirmingProduct, isDecorating, setIsDecorating, removeNameBubble, removeProductBubble, updateConfirmingProduct, getObjectName };
        }

export const useAvatarInfoWidget = useAvatarInfoWidgetState;
