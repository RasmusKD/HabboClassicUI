import { AvatarAction, AvatarExpressionEnum, RoomControllerLevel, RoomObjectCategory, RoomUnitDropHandItemComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { GoArrowDown, GoArrowDownLeft, GoArrowDownRight, GoArrowLeft, GoArrowRight, GoArrowUp, GoArrowUpLeft, GoArrowUpRight } from 'react-icons/go';
import { LuRotateCw } from 'react-icons/lu';
import { AvatarInfoUser, CreateLinkEvent, GetCanStandUp, GetCanUseExpression, GetOwnPosture, GetUserProfile, HasHabboClub, HasHabboVip, IsRidingHorse, LocalizeText, PostureTypeEnum, SendMessageComposer } from '../../../../../api';
import { Column, Flex, LayoutCurrencyIcon } from '../../../../../common';
import { useRoom } from '../../../../../hooks';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetOwnAvatarViewProps
{
    avatarInfo: AvatarInfoUser;
    isDancing: boolean;
    setIsDecorating: Dispatch<SetStateAction<boolean>>;
    onClose: () => void;
}

const MODE_NORMAL = 0;
const MODE_CLUB_DANCES = 1;
const MODE_NAME_CHANGE = 2;
const MODE_EXPRESSIONS = 3;
const MODE_SIGNS = 4;
const MODE_ROTATIONS = 5;

export const AvatarInfoWidgetOwnAvatarView: FC<AvatarInfoWidgetOwnAvatarViewProps> = props =>
{
    const { avatarInfo = null, isDancing = false, setIsDecorating = null, onClose = null } = props;
    const [ mode, setMode ] = useState((isDancing && HasHabboClub()) ? MODE_CLUB_DANCES : MODE_NORMAL);
    const { roomSession = null } = useRoom();
    const [posture, setPosture] = useState<string>(GetOwnPosture());

    useEffect(() => {
        const interval = setInterval(() => {
            const currentPosture = GetOwnPosture();
            if (currentPosture !== posture) {
                setPosture(currentPosture);
            }
        }, 500); // Check every half-second. Adjust this duration as needed.

        return () => clearInterval(interval); // Cleanup on unmount.
    }, [posture]);

    const processAction = (name: string) =>
    {
        let hideMenu = true;

        if(name)
        {
            if(name.startsWith('sign_'))
            {
                const sign = parseInt(name.split('_')[1]);

                roomSession.sendSignMessage(sign);
            }
            else if(name.startsWith('rotation_'))
            {
                const rotation = parseInt(name.split('_')[1]);

                roomSession.sendRotationMessage(rotation);
            }
            else
            {
                switch(name)
                {
                    case 'decorate':
                        setIsDecorating(true);
                        break;
                    case 'change_looks':
                        CreateLinkEvent('avatar-editor/show');
                        break;
                    case 'expressions':
                        hideMenu = false;
                        setMode(MODE_EXPRESSIONS);
                        break;
                    case 'sit':
                        roomSession.sendPostureMessage(PostureTypeEnum.POSTURE_SIT);
                        break;
                    case 'stand':
                        roomSession.sendPostureMessage(PostureTypeEnum.POSTURE_STAND);
                        break;
                    case 'lay':
                        roomSession.sendPostureMessage(PostureTypeEnum.POSTURE_LAY);
                        break;
                    case 'wave':
                        roomSession.sendExpressionMessage(AvatarExpressionEnum.WAVE.ordinal);
                        break;
                    case 'blow':
                        roomSession.sendExpressionMessage(AvatarExpressionEnum.BLOW.ordinal);
                        break;
                    case 'laugh':
                        roomSession.sendExpressionMessage(AvatarExpressionEnum.LAUGH.ordinal);
                        break;
                    case 'idle':
                        roomSession.sendExpressionMessage(AvatarExpressionEnum.IDLE.ordinal);
                        break;
                    case 'dance_menu':
                        hideMenu = false;
                        setMode(MODE_CLUB_DANCES);
                        break;
                    case 'dance':
                        roomSession.sendDanceMessage(1);
                        break;
                    case 'dance_stop':
                        roomSession.sendDanceMessage(0);
                        break;
                    case 'dance_1':
                    case 'dance_2':
                    case 'dance_3':
                    case 'dance_4':
                        roomSession.sendDanceMessage(parseInt(name.charAt((name.length - 1))));
                        break;
                    case 'signs':
                        hideMenu = false;
                        setMode(MODE_SIGNS);
                        break;
                    case 'rotations':
                        hideMenu = false;
                        setMode(MODE_ROTATIONS);
                        break;
                    case 'back':
                        hideMenu = false;
                        setMode(MODE_NORMAL);
                        break;
                    case 'drop_carry_item':
                        SendMessageComposer(new RoomUnitDropHandItemComposer());
                        break;
                }
            }
        }

        if(hideMenu) onClose();
    }

    const isShowDecorate = () => (avatarInfo.amIOwner || avatarInfo.amIAnyRoomController || (avatarInfo.roomControllerLevel > RoomControllerLevel.GUEST));

    const isRidingHorse = IsRidingHorse();

    return (
        <ContextMenuView objectId={ avatarInfo.roomIndex } category={ RoomObjectCategory.UNIT } userType={ avatarInfo.userType } onClose={ onClose } collapsable={ true }>

            <ContextMenuHeaderView className="infostand-name" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                { avatarInfo.name }
            </ContextMenuHeaderView>
                    { (mode === MODE_NORMAL) &&
                <>
                    { isShowDecorate() &&
                        <ContextMenuListItemView onClick={ event => processAction('decorate') }>
                            { LocalizeText('widget.avatar.decorate') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView className="menu-underline" onClick={ event => processAction('change_looks') }>
                        { LocalizeText('widget.memenu.myclothes') }
                    </ContextMenuListItemView>
                    { (HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance_menu') }>
                            <Flex gap={ 1 }>
                                { LocalizeText('widget.memenu.dance') }
                                <i className="icon icon-context-arrow-right mt-auto mb-auto"/>
                            </Flex>
                        </ContextMenuListItemView> }
                    { (!isDancing && !HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance') }>
                            <Flex gap={ 1 }>
                                { LocalizeText('widget.memenu.dance') }
                                <i className="icon icon-context-arrow-right mt-auto mb-auto"/>
                            </Flex>
                        </ContextMenuListItemView> }
                    { (isDancing && !HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance_stop') }>
                            { LocalizeText('widget.memenu.dance.stop') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('expressions') }>
                        <Flex gap={ 1 }>
                            { LocalizeText('infostand.link.expressions') }
                            <i className="icon icon-context-arrow-right mt-auto mb-auto"/>
                        </Flex>
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('signs') }>
                        <Flex gap={ 1 }>
                            { LocalizeText('infostand.show.signs') }
                            <i className="icon icon-context-arrow-right mt-auto mb-auto"/>
                        </Flex>
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('rotations') }>
                        <Flex gap={ 1 }>
                            Roter
                            <i className="icon icon-context-arrow-right mt-auto mb-auto"/>
                        </Flex>
                    </ContextMenuListItemView>
                    { (avatarInfo.carryItem > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('drop_carry_item') }>
                            { LocalizeText('avatar.widget.drop_hand_item') }
                        </ContextMenuListItemView> }
                </> }
                    { (mode === MODE_CLUB_DANCES) &&
                <>
                    { isDancing &&
                        <ContextMenuListItemView onClick={ event => processAction('dance_stop') }>
                            { LocalizeText('widget.memenu.dance.stop') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('dance_1') }>
                        { LocalizeText('widget.memenu.dance1') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('dance_2') }>
                        { LocalizeText('widget.memenu.dance2') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('dance_3') }>
                        { LocalizeText('widget.memenu.dance3') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('dance_4') }>
                        { LocalizeText('widget.memenu.dance4') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <Flex gap={ 1 }>
                            <i className="icon icon-context-arrow-left mt-auto mb-auto"/>
                            { LocalizeText('generic.back') }
                        </Flex>
                    </ContextMenuListItemView>
                </> }
                    { (mode === MODE_EXPRESSIONS) &&
                <>
                    { (GetOwnPosture() === AvatarAction.POSTURE_STAND || GetOwnPosture() === AvatarAction.POSTURE_LAY) &&
                        <ContextMenuListItemView onClick={ event => processAction('sit') }>
                            { LocalizeText('widget.memenu.sit') }
                        </ContextMenuListItemView> }
                    { (GetOwnPosture() === AvatarAction.POSTURE_SIT || GetOwnPosture() === AvatarAction.POSTURE_LAY) &&
                        <ContextMenuListItemView onClick={ event => processAction('stand') }>
                            { LocalizeText('widget.memenu.stand') }
                        </ContextMenuListItemView> }
                    { (GetOwnPosture() === AvatarAction.POSTURE_STAND || GetOwnPosture() === AvatarAction.POSTURE_SIT) &&
                        <ContextMenuListItemView onClick={ event => processAction('lay') }>
                            { LocalizeText('widget.memenu.lay') }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView onClick={ event => processAction('wave') }>
                            { LocalizeText('widget.memenu.wave') }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView disabled={ !HasHabboVip() } onClick={ event => processAction('laugh') }>
                            { !HasHabboVip() && <LayoutCurrencyIcon type="hc" /> }
                            { LocalizeText('widget.memenu.laugh') }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView disabled={ !HasHabboVip() } onClick={ event => processAction('blow') }>
                            { !HasHabboVip() && <LayoutCurrencyIcon type="hc" /> }
                            { LocalizeText('widget.memenu.blow') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('idle') }>
                        { LocalizeText('widget.memenu.idle') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <Flex gap={ 1 }>
                            <i className="icon icon-context-arrow-left mt-auto mb-auto"/>
                            { LocalizeText('generic.back') }
                        </Flex>
                    </ContextMenuListItemView>
                </> }
                    { (mode === MODE_SIGNS) &&
                <>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_1') }>
                            1
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_2') }>
                            2
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_3') }>
                            3
                        </ContextMenuListItemView>
                    </Flex>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_4') }>
                            4
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_5') }>
                            5
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_6') }>
                            6
                        </ContextMenuListItemView>
                    </Flex>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_7') }>
                            7
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_8') }>
                            8
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_9') }>
                            9
                        </ContextMenuListItemView>
                    </Flex>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_10') }>
                            10
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_11') }>
                            <i className="icon icon-sign-heart" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_12') }>
                            <i className="icon icon-sign-skull" />
                        </ContextMenuListItemView>
                    </Flex>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_0') }>
                            0
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_13') }>
                            <i className="icon icon-sign-exclamation" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_15') }>
                            <i className="icon icon-sign-smile" />
                        </ContextMenuListItemView>
                    </Flex>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_14') }>
                            <i className="icon icon-sign-soccer" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_17') }>
                            <i className="icon icon-sign-yellow" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_16') }>
                            <i className="icon icon-sign-red" />
                        </ContextMenuListItemView>
                    </Flex>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <Flex gap={ 1 }>
                            <i className="icon icon-context-arrow-left mt-auto mb-auto"/>
                            { LocalizeText('generic.back') }
                        </Flex>
                    </ContextMenuListItemView>
                </> }
                { (mode === MODE_ROTATIONS) &&
                <>
                <Flex className="menu-list-split-3">
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_LAY} onClick={event => processAction('rotation_6')}>
                        <GoArrowUpLeft className="font-size-18" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_SIT || posture === AvatarAction.POSTURE_LAY} onClick={event => processAction('rotation_7')}>
                        <GoArrowUp className="font-size-18" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_LAY} onClick={ event => processAction('rotation_0') }>
                        <GoArrowUpRight className="font-size-18" />
                    </ContextMenuListItemView>
                </Flex>
                <Flex className="menu-list-split-3">
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_SIT || posture === AvatarAction.POSTURE_LAY} onClick={ event => processAction('rotation_5') }>
                        <GoArrowLeft className="font-size-18" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_LAY} onClick={ event => processAction('rotation_8') }>
                        <LuRotateCw className="font-size-18" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_SIT || posture === AvatarAction.POSTURE_LAY} onClick={ event => processAction('rotation_1') }>
                        <GoArrowRight className="font-size-18" />
                    </ContextMenuListItemView>
                </Flex>
                <Flex className="menu-list-split-3">
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK} onClick={ event => processAction(GetOwnPosture() === AvatarAction.POSTURE_LAY ? 'rotation_0' : 'rotation_4') }>
                        <GoArrowDownLeft className="font-size-18" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK || posture === AvatarAction.POSTURE_SIT || posture === AvatarAction.POSTURE_LAY} onClick={ event => processAction('rotation_3') }>
                        <GoArrowDown className="font-size-18" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView disabled={posture === AvatarAction.POSTURE_WALK} onClick={ event => processAction('rotation_2') }>
                        <GoArrowDownRight className="font-size-18" />
                    </ContextMenuListItemView>
                </Flex>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <Flex gap={ 1 }>
                            <i className="icon icon-context-arrow-left mt-auto mb-auto"/>
                            { LocalizeText('generic.back') }
                        </Flex>
                    </ContextMenuListItemView>
                </> }
        </ContextMenuView>
    );
}
