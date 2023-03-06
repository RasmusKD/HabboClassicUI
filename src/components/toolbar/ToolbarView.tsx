import { Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useState, useRef, useEffect } from 'react';
import { CreateLinkEvent, GetConfiguration, GetSessionDataManager, MessengerIconState, OpenMessengerChat, VisitDesktop } from '../../api';
import { Tooltip, Base, Flex, LayoutAvatarImageView, LayoutItemCountView, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useMessageEvent, useMessenger, useRoomEngineEvent, useSessionInfo } from '../../hooks';
import { ToolbarMeView } from './ToolbarMeView';

export const ToolbarView: FC<{ isInRoom: boolean }> = props =>
{
    const { isInRoom } = props;
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ leftSideCollapsed, setLeftSideCollapsed ] = useState(true);
    const [ rightSideCollapsed, setRightSideCollapsed ] = useState(true);
    const [ useGuideTool, setUseGuideTool ] = useState(false);
    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const isMod = GetSessionDataManager().isModerator;

    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
    {
        const parser = event.getParser();

        setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
    });

    useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

            if(!target) return;

            image.className = 'toolbar-icon-animation';
            image.style.visibility = 'visible';
            image.style.left = (x + 'px');
            image.style.top = (y + 'px');

            document.body.append(image);

            const targetBounds = target.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();

            const left = (imageBounds.x - targetBounds.x);
            const top = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height = 20;

            const motionName = (`ToolbarBouncing[${ iconName }]`);

            if(!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

            Motions.runMotion(motion);
        }

        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

    return (
        <>
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isMeExpanded } timeout={ 300 }>
                <ToolbarMeView useGuideTool={ useGuideTool } unseenAchievementCount={ getTotalUnseen } setMeExpanded={ setMeExpanded } />
            </TransitionAnimation>
            <Flex alignItems="center" id="toolbar-chat-input-container" />
            <Flex alignItems="center" justifyContent="between" gap={ 2 } className={ isInRoom ? 'nitro-toolbar px-3' : 'nitro-toolbar2 px-3' }>
                <button className={ leftSideCollapsed ? 'toolbar-left-collapse' : 'toolbar-left-collapse-active' } onClick={ () => setLeftSideCollapsed((collapsed) => !collapsed) }/>
                <Flex gap={ 2 } alignItems="center" className="toolbar-left-side">
                    <Flex alignItems="center" gap={ 2 }>
                        { leftSideCollapsed &&
                        <Flex gap={ 2 }>
                            { isInRoom &&
                            <Tooltip content="Gå til hoteloversigten"><Base pointer className="navigation-item icon icon-habbo" onClick={ event => VisitDesktop() } /></Tooltip> }
                            { !isInRoom &&
                            <Tooltip content="Gå til dit Startrum"><Base pointer className="navigation-item icon icon-house" onClick={ event => CreateLinkEvent('navigator/goto/home') } /></Tooltip>  }
                            <Tooltip content="Rum"><Base pointer className="navigation-item icon icon-rooms" onClick={ event => CreateLinkEvent('navigator/toggle') } /></Tooltip>
                        </Flex> }
                        { GetConfiguration('game.center.enabled') && leftSideCollapsed && <Tooltip content="Spil"><Base pointer className="navigation-item icon icon-game" onClick={ event => CreateLinkEvent('games/toggle') } /></Tooltip>  }
                        <Tooltip content="Shop"><Base pointer className="navigation-item icon icon-catalog" onClick={ event => CreateLinkEvent('catalog/toggle') } /></Tooltip>
                        <Tooltip content="Mine ting"><Base pointer className="navigation-item icon icon-inventory" onClick={ event => CreateLinkEvent('inventory/toggle') }>
                            { (getFullCount > 0) &&
                                <LayoutItemCountView count={ getFullCount } /> }
                        </Base></Tooltip>
                        <Tooltip content="Mig"><Flex center pointer className={ 'navigation-item item-avatar ' + (isMeExpanded ? 'active ' : '') } onClick={ event => setMeExpanded(!isMeExpanded) }>
                            <LayoutAvatarImageView figure={ userFigure } direction={ 2 } position="absolute" />
                            { (getTotalUnseen > 0) &&
                                <LayoutItemCountView count={ getTotalUnseen } /> }
                        </Flex></Tooltip>
                        { isInRoom &&
                            <Tooltip content="Kamera"><Base pointer className="navigation-item icon icon-camera" onClick={ event => CreateLinkEvent('camera/toggle') } /></Tooltip> }
                        { isMod &&
                            <Tooltip content="Mod Tools"><Base pointer className={ 'navigation-item icon icon-modtools' + (isInRoom ? ' modtool-margin' : '') } onClick={ event => CreateLinkEvent('mod-tools/toggle') } /></Tooltip>  }
                    </Flex>
                </Flex>
                <Flex alignItems="center" gap={ 2 }>
                    <Flex gap={ 2 }>
                        <Tooltip content="Alle Venner"><Base pointer className="navigation-item icon icon-friendall" onClick={ event => CreateLinkEvent('friends/togglefriends') }>
                            { (requests.length > 0) &&
                                <LayoutItemCountView count={ requests.length } /> }
                        </Base></Tooltip>
                        <Tooltip content="Søg Habboer"><Base pointer className="navigation-item icon icon-friendsearch" onClick={ event => CreateLinkEvent('friends/togglesearch') } /></Tooltip>
                        { ((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) &&
                        <Tooltip content="Chat"><Base pointer className={ `navigation-item icon icon-message ${ (iconState === MessengerIconState.UNREAD) && 'is-unseen' }` } onClick={ event => OpenMessengerChat() } /></Tooltip> }
                    </Flex>
                    <Base id="toolbar-friend-bar-container" className={ rightSideCollapsed ? 'd-none d-lg-block' : 'd-none' } />
                </Flex>
                <button className={ rightSideCollapsed ? 'toolbar-right-collapse' : 'toolbar-right-collapse-active' } onClick={ () => setRightSideCollapsed((collapsed) => !collapsed) }/>
            </Flex>
        </>
    );
}
