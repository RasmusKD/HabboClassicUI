import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LayoutGridAchievementBadges } from '../../../../common';
import { useAchievements } from '../../../../hooks';
import { AchievementBadgeView } from '../AchievementBadgeView';

interface AchievementListItemViewProps
{
    achievement: AchievementData;
}

export const AchievementListItemView: FC<AchievementListItemViewProps> = props =>
{
    const { achievement = null } = props;
    const { selectedAchievement = null, setSelectedAchievementId = null } = useAchievements();

    if(!achievement) return null;

    return (
        <LayoutGridAchievementBadges itemActive={ (selectedAchievement === achievement) } itemUnseen={ (achievement.unseen > 0) } onClick={ event => setSelectedAchievementId(achievement.achievementId) }>
            <AchievementBadgeView achievement={ achievement } />
        </LayoutGridAchievementBadges>
    );
}
