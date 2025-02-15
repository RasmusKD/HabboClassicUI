import { Dispatch, FC, SetStateAction } from 'react';
import { AchievementUtilities, IAchievementCategory, LocalizeText } from '../../../../api';
import { LayoutBackgroundImage, LayoutGridAchievement, LayoutGridItem, Text } from '../../../../common';

interface AchievementCategoryListItemViewProps
{
    category: IAchievementCategory;
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListItemView: FC<AchievementCategoryListItemViewProps> = props =>
{
    const { category = null, selectedCategoryCode = null, setSelectedCategoryCode = null } = props;

    if(!category) return null;

    const progress = AchievementUtilities.getAchievementCategoryProgress(category);
    const maxProgress = AchievementUtilities.getAchievementCategoryMaxProgress(category);
    const getCategoryImage = AchievementUtilities.getAchievementCategoryImageUrl(category, progress);
    const getTotalUnseen = AchievementUtilities.getAchievementCategoryTotalUnseen(category);

    return (
        <LayoutGridAchievement itemActive={ (selectedCategoryCode === category.code) } itemCount={ getTotalUnseen } itemCountMinimum={ 0 } gap={ 1 } onClick={ event => setSelectedCategoryCode(category.code) }>
            <Text bold fullWidth center small className="pt-1">{ LocalizeText(`quests.${ category.code }.name`) }</Text>
            <LayoutBackgroundImage position="relative" imageUrl={ getCategoryImage }>
                <Text bold fullWidth center position="absolute" variant="white" style={ { fontSize: 12, bottom: 6 } }>{ progress } / { maxProgress }</Text>
            </LayoutBackgroundImage>
        </LayoutGridAchievement>
    );
}
