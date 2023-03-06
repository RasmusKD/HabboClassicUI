import { FC, useState, useEffect } from 'react';
import { MessengerFriend } from '../../../../api';
import { Button, Flex } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = (props) => {
  const { onlineFriends = null } = props;
  const [indexOffset, setIndexOffset] = useState(0);
  const [maxDisplayCount, setMaxDisplayCount] = useState(0);

  useEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth || 0;
      const maxItemCount = Math.floor((windowWidth - 730) / 127);
      setMaxDisplayCount(maxItemCount);
      setIndexOffset(0); // set indexOffset to 0 on resize
    }

    handleResize(); // initial calculation
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const maxIndexOffset = onlineFriends.length - Math.max(maxDisplayCount, 0);
  const displayedFriends = onlineFriends.slice(
    Math.min(indexOffset, maxIndexOffset),
    Math.min(indexOffset + Math.max(maxDisplayCount, 0), onlineFriends.length)
  );

  if (onlineFriends.length < 3) {
    // add dummy friends to the array
    const dummyFriendsCount = 3 - displayedFriends.length;
    for (let i = 0; i < dummyFriendsCount; i++) {
      displayedFriends.push(null);
    }
  }

  const stepSize = maxDisplayCount || 1; // use 1 as minimum step size

  return (
    <Flex alignItems="center" className="friend-bar">
      {onlineFriends.length > maxDisplayCount && (
        <button
          className="friend-bar-button left"
          disabled={indexOffset <= 0}
          onClick={(event) => setIndexOffset(Math.max(indexOffset - stepSize, 0))}
        />
      )}
      {displayedFriends.map((friend, i) => (
        <FriendBarItemView key={i} friend={friend} />
      ))}
      {onlineFriends.length > maxDisplayCount && (
        <button
          className="friend-bar-button right"
          disabled={indexOffset + maxDisplayCount >= onlineFriends.length}
          onClick={(event) => setIndexOffset(Math.min(indexOffset + stepSize, maxIndexOffset))}
        />
      )}
    </Flex>
  );
};
