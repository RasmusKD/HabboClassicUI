import { FC, useState } from 'react';
import { MessengerFriend } from '../../../../../api';
import { FriendsListGroupItemView2 } from './FriendsListGroupItemView2';
import { useFriends } from '../../../../../hooks';

interface FriendsListGroupView2Props
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
    setIsHovering: React.Dispatch<React.SetStateAction<{}>>;

}

export const FriendsListGroupView2: FC<FriendsListGroupView2Props> = props =>
{
    const { list = null, selectedFriendsIds = null, selectFriend = null, setIsHovering} = props;
    const { onlineFriends } = useFriends();

    if(!list || !list.length) return null;

    return (
        <>
            { list.map((item, index) => <FriendsListGroupItemView2 key={ index } friend={ item } selected={ selectedFriendsIds && (selectedFriendsIds.indexOf(item.id) >= 0) } selectFriend={ selectFriend } setIsHovering={ setIsHovering } onlineFriends={onlineFriends}/>) }
        </>
    );
}
