import { FC, MouseEvent, useState } from 'react';
import { LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { Base, Flex, LayoutAvatarImageView, NitroCardAccordionItemView, UserProfileIconView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListGroupItemView: FC<{ friend: MessengerFriend, selected: boolean, selectFriend: (userId: number) => void, setIsHovering: any }> = props =>
{
    const { friend = null, selected = false, selectFriend = null, setIsHovering } = props;
    const [ isRelationshipOpen, setIsRelationshipOpen ] = useState<boolean>(false);
    const { followFriend = null, updateRelationship = null } = useFriends();
    const handleHover = (index, value) => {
        setIsHovering(prevValue => ({ ...prevValue, [index]: value }));
    };

    const clickFollowFriend = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        followFriend(friend);
    }

    const openMessengerChat = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        OpenMessengerChat(friend.id);
    }

    const openRelationship = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        setIsRelationshipOpen(true);
    }

    const clickUpdateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) =>
    {
        event.stopPropagation();

        updateRelationship(friend, type);

        setIsRelationshipOpen(false);
    }

    const getCurrentRelationshipName = () =>
    {
        if(!friend) return 'none';

        switch(friend.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            case MessengerFriend.RELATIONSHIP_POOP: return 'poop';
            default: return 'none';
        }
    }

    if(!friend) return null;

    return (
        <NitroCardAccordionItemView justifyContent="between" className={ `friend-tab-height friend-tab px-2 py-1 ${ selected && 'bg-friends text-white' }` } onClick={ event => selectFriend(friend.id) }>
            { friend.online &&
            <Flex alignItems="center" className="test-relative friend-tab-height2" gap={ 1 }>
                <Flex className="friend-head px-1">
                    <LayoutAvatarImageView figure={ friend.figure } headOnly={ true } direction={ 2 } />
                </Flex>
                <Base className="friend-elements-relative2" onClick={ event => event.stopPropagation() }>
                    <UserProfileIconView onMouseOver={() => handleHover(4, true)} onMouseOut={() => handleHover(4, false)} userId={ friend.id } />
                </Base>
                <div className="friend-elements-relative2">{ friend.name }</div>
            </Flex>}
            { !friend.online &&
            <Flex alignItems="center" className="friend-tab-height2" gap={ 1 }>
                <Base className="friend-elements-relative2" onClick={ event => event.stopPropagation() }>
                    <UserProfileIconView onMouseOver={() => handleHover(4, true)} onMouseOut={() => handleHover(4, false)} userId={ friend.id } />
                </Base>
                <div className="friend-elements-relative2" >{ friend.name }</div>
            </Flex>}
            <Flex alignItems="center" gap={ 1 }>
                { !isRelationshipOpen &&
                    <>
                        { friend.followingAllowed &&
                            <Base pointer onMouseOver={() => handleHover(5, true)} onMouseOut={() => handleHover(5, false)} onClick={ clickFollowFriend } className="nitro-friends-spritesheet icon-follow"  /> }
                        { friend.online &&
                            <Base pointer onMouseOver={() => handleHover(6, true)} onMouseOut={() => handleHover(6, false)} className="nitro-friends-spritesheet icon-chat" onClick={ openMessengerChat } /> }
                        { (friend.id > 0) &&
                            <Base onMouseOver={() => handleHover(7, true)} onMouseOut={() => handleHover(7, false)} className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() } cursor-pointer` } onClick={ openRelationship } /> }
                    </> }
                { isRelationshipOpen &&
                    <>
                        <Base pointer className="nitro-friends-spritesheet icon-heart" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART) } />
                        <Base pointer className="nitro-friends-spritesheet icon-smile" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE) } />
                        <Base pointer className="nitro-friends-spritesheet icon-bobba" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA) } />
                        <Base pointer className="nitro-friends-spritesheet icon-poop" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_POOP) } />
                        <Base onMouseOver={() => handleHover(7, true)} onMouseOut={() => handleHover(7, false)} pointer className="nitro-friends-spritesheet icon-none" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE) } />
                    </> }
            </Flex>
        </NitroCardAccordionItemView>
    );
}
