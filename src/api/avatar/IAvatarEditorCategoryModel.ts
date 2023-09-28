import { CategoryData } from './CategoryData';

export interface IAvatarEditorCategoryModel
{
    init(): void;
    dispose(): void;
    reset(): void;
    getCategoryData(category: string): CategoryData;
    selectPart(category: string, partIndex: number): void;
    selectColor(category: string, color: string, colorPickerIndex: number): void;
    hasClubSelectionsOverLevel(level: number): boolean;
    hasInvalidSelectedItems(ownedItems: number[]): boolean;
    stripClubItemsOverLevel(level: number): boolean;
    stripInvalidSellableItems(): boolean;
    categories: Map<string, CategoryData>;
    canSetGender: boolean;
    maxPaletteCount: number;
    name: string;
}
