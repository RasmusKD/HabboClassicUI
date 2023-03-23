import { PetRespectComposer, PetType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AvatarInfoPet, ConvertSeconds, CreateLinkEvent, GetConfiguration, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutCounterTimeView, LayoutPetImageView, LayoutRarityLevelView, Text, UserProfileIconView } from '../../../../../common';
import { useRoom, useSessionInfo } from '../../../../../hooks';

interface InfoStandWidgetPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;
    const [ remainingGrowTime, setRemainingGrowTime ] = useState(0);
    const [ remainingTimeToLive, setRemainingTimeToLive ] = useState(0);
    const { roomSession = null } = useRoom();
    const { petRespectRemaining = 0, respectPet = null } = useSessionInfo();

    useEffect(() =>
    {
        setRemainingGrowTime(avatarInfo.remainingGrowTime);
        setRemainingTimeToLive(avatarInfo.remainingTimeToLive);
    }, [ avatarInfo ]);

    useEffect(() =>
    {
        if((avatarInfo.petType !== PetType.MONSTERPLANT) || avatarInfo.dead) return;

        const interval = setInterval(() =>
        {
            setRemainingGrowTime(prevValue => (prevValue - 1));
            setRemainingTimeToLive(prevValue => (prevValue - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [ avatarInfo ]);

    if(!avatarInfo) return null;

    const processButtonAction = (action: string) =>
    {
        let hideMenu = true;

        if (!action || action == '') return;

        switch (action)
        {
            case 'respect':
                respectPet(avatarInfo.id);

                if((petRespectRemaining - 1) >= 1) hideMenu = false;
                break;
            case 'buyfood':
                CreateLinkEvent('catalog/open/' + GetConfiguration('catalog.links')['pets.buy_food']);
                break;
            case 'train':
                roomSession?.requestPetCommands(avatarInfo.id);
                break;
            case 'treat':
                SendMessageComposer(new PetRespectComposer(avatarInfo.id));
                break;
            case 'compost':
                roomSession?.compostPlant(avatarInfo.id);
                break;
            case 'pick_up':
                roomSession?.pickupPet(avatarInfo.id);
                break;
        }

        if(hideMenu) onClose();
    }

    return (
        <Column gap={ 1 } alignItems="end">
            <Column className="nitro-infostand rounded">
                <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex className="pet-name-center w-100" alignItems="center" gap={ 1 }>
                            <Text gfbold variant="white" wrap>{ avatarInfo.name }</Text>
                            <i className="infostand-close pet-close-margin" onClick={ onClose } />
                        </Flex>
                        <Text center variant="white" wrap>{ LocalizeText(`pet.breed.${ avatarInfo.petType }.${ avatarInfo.petBreed }`) }</Text>
                    </Column>
                    { (avatarInfo.petType === PetType.MONSTERPLANT) &&
                        <>
                            <Flex gap={ 1 }>
                            <Column fullWidth overflow="hidden" className="body-image pet p-1">
                                <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 2 } />
                            </Column>
                                { !avatarInfo.dead &&
                            <Column grow gap={ 1 }>
                                <Text variant="white" center wrap>{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                            </Column>}
                            </Flex>
                                <Column gap={ 2 }>
                                <Column alignItems="center" gap={ 1 }>
                                    <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.wellbeing') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="pet-bg">
                                        <Flex fit center position="absolute">
                                            <Text variant="white">{ avatarInfo.dead ? '00:00:00' : ConvertSeconds((remainingTimeToLive == 0 ? avatarInfo.remainingTimeToLive : remainingTimeToLive)).split(':')[1] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[2] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[3] }</Text>
                                        </Flex>
                                        <Base className="hclassic-pet-energy pet-stats" style={ { width: avatarInfo.dead ? '0' : Math.round((avatarInfo.maximumTimeToLive * 100) / (remainingTimeToLive)).toString() } } />
                                    </Base>
                                </Column>
                                { remainingGrowTime != 0 && remainingGrowTime > 0 &&
                                    <Column alignItems="center" gap={ 1 }>
                                        <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.growth') }</Text>
                                        <LayoutCounterTimeView className="top-2 end-2" day={ ConvertSeconds(remainingGrowTime).split(':')[0] } hour={ ConvertSeconds(remainingGrowTime).split(':')[1] } minutes={ ConvertSeconds(remainingGrowTime).split(':')[2] } seconds={ ConvertSeconds(remainingGrowTime).split(':')[3] } />
                                    </Column> }
                                <Column alignItems="center" gap={ 1 }>
                                    <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.raritylevel', [ 'level' ], [ LocalizeText(`infostand.pet.raritylevel.${ avatarInfo.rarityLevel }`) ]) }</Text>
                                    <LayoutRarityLevelView className="top-2 end-2" level={ avatarInfo.rarityLevel } />
                                </Column>
                            </Column>
                            <Column className="pet-text-center" gap={ 1 }>
                                <Text variant="white" wrap>{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                                <Text variant="white" wrap>{ LocalizeText('infostand.text.petowner', [ 'name' ], [ avatarInfo.ownerName ]) }</Text>
                            </Column>
                        </> }
                    { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                        <>
                    <Column gap={ 1 }>
                        <Flex gap={ 1 }>
                            <Column fullWidth overflow="hidden" className="body-image pet p-1">
                                <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 4 } />
                            </Column>
                            <Column grow gap={ 1 }>
                                <Text variant="white" center wrap>{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                            </Column>
                        </Flex>
                            <Column className="pet-padding" alignItems="center" gap={ 1 }>
                                    <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.happiness') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="pet-bg">
                                        <Flex fit center position="absolute">
                                            <Text variant="white">{ avatarInfo.happyness + '/' + avatarInfo.maximumHappyness }</Text>
                                        </Flex>
                                        <Flex>
                                        <Base className="hclassic-pet-happiness pet-stats" style={ { width: (avatarInfo.happyness / avatarInfo.maximumHappyness) * 100 + '%' } } />
                                        <i className="pet-happiness"/>
                                        </Flex>
                                    </Base>
                                </Column>
                                <Column className="pet-padding" alignItems="center" gap={ 1 }>
                                    <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.experience') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="pet-bg">
                                        <Flex fit center position="absolute">
                                            <Text variant="white">{ avatarInfo.experience + '/' + avatarInfo.levelExperienceGoal }</Text>
                                        </Flex>
                                        <Flex>
                                        <Base className="hclassic-pet-experience pet-stats" style={ { width: (avatarInfo.experience / avatarInfo.levelExperienceGoal) * 100 + '%' } } />
                                        <i className="pet-experience"/>
                                        </Flex>
                                    </Base>
                                </Column>
                                <Column className="pet-padding" alignItems="center" gap={ 1 }>
                                    <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.energy') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="pet-bg">
                                        <Flex fit center position="absolute">
                                            <Text variant="white">{ avatarInfo.energy + '/' + avatarInfo.maximumEnergy }</Text>
                                        </Flex>
                                        <Flex>
                                        <Base className="hclassic-pet-energy pet-stats" style={ { width: (avatarInfo.energy / avatarInfo.maximumEnergy) * 100 + '%' } } />
                                        <i className="pet-energy"/>
                                        </Flex>
                                    </Base>
                                </Column>
                        <hr className="m-0" />
                    </Column>
                    <Column className="pet-text-center" gap={ 1 }>
                        { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                        <Flex center>
                            <Text variant="white" wrap>{ LocalizeText('infostand.text.petrespect', [ 'count' ], [ avatarInfo.respect.toString() ]) }</Text>
                            <i className="pet-scratched"/>
                            </Flex>}
                                <Text variant="white" wrap>{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                                <Text variant="white" wrap>{ LocalizeText('infostand.text.petowner', [ 'name' ], [ avatarInfo.ownerName ]) }</Text>
                            </Column>
                        </> }
                </Column>
            </Column>
            <Flex gap={ 1 } justifyContent="end">
                { avatarInfo.petType !== PetType.MONSTERPLANT &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('buyfood') }>
                        { LocalizeText('infostand.button.buyfood') }
                    </Button>
                }
                { avatarInfo.isOwner && avatarInfo.petType !== PetType.MONSTERPLANT &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </Button>
                }
                { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) && avatarInfo.petType === PetType.MONSTERPLANT &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('treat') }>
                        { LocalizeText('infostand.button.pettreat') }
                    </Button>
                }
                { roomSession?.isRoomOwner && avatarInfo.petType === PetType.MONSTERPLANT &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('compost') }>
                        { LocalizeText('infostand.button.compost') }
                    </Button>
                }
                { avatarInfo.isOwner &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('pick_up') }>
                        { LocalizeText('infostand.button.pickup') }
                    </Button>
                }
                { (petRespectRemaining > 0) && avatarInfo.petType !== PetType.MONSTERPLANT &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('respect') }>
                        { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespectRemaining.toString() ]) }
                    </Button>
                }
            </Flex>
        </Column>
    );
}
