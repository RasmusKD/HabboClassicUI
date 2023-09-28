import { IPartColor, PartColor } from '@nitrots/nitro-renderer';
import { GetAvatarPalette, GetAvatarRenderManager, GetAvatarSetType, GetClubMemberLevel, GetConfiguration } from '../nitro';
import { AvatarEditorColorPicker } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';
import { CategoryBaseModel } from './CategoryBaseModel';
import { CategoryData } from './CategoryData';
import { FigureData } from './FigureData';

export class AvatarEditorUtilities
{
    private static MAX_PALETTES: number = 2;

    public static CURRENT_FIGURE: FigureData = null;
    public static FIGURE_SET_IDS: number[] = [];
    public static BOUND_FURNITURE_NAMES: string[] = [];

    public static getGender(gender: string): string
    {
        switch(gender)
        {
            case FigureData.MALE:
            case 'm':
            case 'M':
                gender = FigureData.MALE;
                break;
            case FigureData.FEMALE:
            case 'f':
            case 'F':
                gender = FigureData.FEMALE;
                break;
            default:
                gender = FigureData.MALE;
        }

        return gender;
    }

    public static hasFigureSetId(setId: number): boolean
    {
        return (this.FIGURE_SET_IDS.indexOf(setId) >= 0);
    }

    public static createCategory(model: CategoryBaseModel, name: string): CategoryData
    {
        if(!model || !name || !this.CURRENT_FIGURE) return null;

        const partItems: AvatarEditorGridPartItem[] = [];
        const colorPickers: AvatarEditorColorPicker[] = [];

        let i = 0;

        const setType = GetAvatarSetType(name);

        if(!setType) return null;

        let hexColors = this.CURRENT_FIGURE.getHexColors(name);

        if(!hexColors) hexColors = [];

        const hexColorsCount = parseInt('0xFFFFFF') + 1;
        const hexColorsByMaxPalette = Math.floor(hexColorsCount / this.MAX_PALETTES);
        const partColors: IPartColor[] = new Array(hexColors.length);
        const clubItemsDimmed = this.clubItemsDimmed;
        const clubMemberLevel = GetClubMemberLevel();

        if(clubItemsDimmed)
        {
            let i = 0;

            while(i < this.MAX_PALETTES)
            {
                const colorPicker = new AvatarEditorColorPicker(new PartColor((i * hexColorsByMaxPalette).toString(16)));
                colorPickers.push(colorPicker);

                i++;
            }

            if(name !== FigureData.FACE)
            {
                let i = 0;

                while(i < hexColors.length)
                {
                    partColors[i] = new PartColor(hexColors[i]);

                    i++;
                }
            }
        }

        let mandatorySetIds: string[] = [];

        if(clubItemsDimmed)
        {
            mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this.CURRENT_FIGURE.gender, 2);
        }
        else
        {
            mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this.CURRENT_FIGURE.gender, clubMemberLevel);
        }

        const isntMandatorySet = (mandatorySetIds.indexOf(name) === -1);

        if(isntMandatorySet)
        {
            const partItem = new AvatarEditorGridPartItem(null, null, false);

            partItem.isClear = true;

            partItems.push(partItem);
        }

        const usesColors = (name !== FigureData.FACE);
        const partSets = setType.partSets;
        const totalPartSets = partSets.length;

        i = (totalPartSets - 1);

        while(i >= 0)
        {
            const partSet = partSets.getWithIndex(i);

            let isValidGender = false;

            if(partSet.gender === FigureData.UNISEX)
            {
                isValidGender = true;
            }

            else if(partSet.gender === this.CURRENT_FIGURE.gender)
            {
                isValidGender = true;
            }

            if(partSet.isSelectable && isValidGender && (clubItemsDimmed || (clubMemberLevel >= partSet.clubLevel)))
            {
                const isDisabled = (clubMemberLevel < partSet.clubLevel);

                let isValid = true;

                if(partSet.isSellable) isValid = this.hasFigureSetId(partSet.id);

                if(isValid) partItems.push(new AvatarEditorGridPartItem(partSet, partColors, usesColors, isDisabled));
            }

            i--;
        }

        partItems.sort(this.clubItemsFirst ? this.clubSorter : this.noobSorter);

        // if(this._forceSellableClothingVisibility || GetNitroInstance().getConfiguration<boolean>("avatareditor.support.sellablefurni", false))
        // {
        //     _local_31 = (this._manager.windowManager.assets.getAssetByName("camera_zoom_in") as BitmapDataAsset);
        //     _local_32 = (_local_31.content as BitmapData).clone();
        //     _local_33 = (AvatarEditorView._Str_6802.clone() as IWindowContainer);
        //     _local_33.name = AvatarEditorGridView.GET_MORE;
        //     _local_7 = new AvatarEditorGridPartItem(_local_33, k, null, null, false);
        //     _local_7._Str_3093 = _local_32;
        //     _local_3.push(_local_7);
        // }

        return new CategoryData(name, partItems, colorPickers);
    }

    public static clubSorter(a: AvatarEditorGridPartItem, b: AvatarEditorGridPartItem): number
    {
        const clubLevelA = (!a.partSet ? 9999999999 : a.partSet.clubLevel);
        const clubLevelB = (!b.partSet ? 9999999999 : b.partSet.clubLevel);
        const isSellableA = (!a.partSet ? false : a.partSet.isSellable);
        const isSellableB = (!b.partSet ? false : b.partSet.isSellable);

        if(isSellableA && !isSellableB) return 1;

        if(isSellableB && !isSellableA) return -1;

        if(clubLevelA > clubLevelB) return -1;

        if(clubLevelA < clubLevelB) return 1;

        if(a.partSet.id > b.partSet.id) return -1;

        if(a.partSet.id < b.partSet.id) return 1;

        return 0;
    }

    public static colorSorter(a: AvatarEditorColorPicker, b: AvatarEditorColorPicker): number
    {
        if(a.partColor.rgb < b.partColor.rgb) return -1;

        if(a.partColor.rgb > b.partColor.rgb) return 1;

        return 0;
    }

    public static noobSorter(a: AvatarEditorGridPartItem, b: AvatarEditorGridPartItem): number
    {
        const clubLevelA = (!a.partSet ? -1 : a.partSet.clubLevel);
        const clubLevelB = (!b.partSet ? -1 : b.partSet.clubLevel);
        const isSellableA = (!a.partSet ? false : a.partSet.isSellable);
        const isSellableB = (!b.partSet ? false : b.partSet.isSellable);

        if(isSellableA && !isSellableB) return 1;

        if(isSellableB && !isSellableA) return -1;

        if(clubLevelA < clubLevelB) return -1;

        if(clubLevelA > clubLevelB) return 1;

        if(a.partSet.id < b.partSet.id) return -1;

        if(a.partSet.id > b.partSet.id) return 1;

        return 0;
    }

    public static avatarSetFirstSelectableColor(name: string): string
    {
        return '000000';
    }

    public static get clubItemsFirst(): boolean
    {
        return GetConfiguration<boolean>('avatareditor.show.clubitems.first', true);
    }

    public static get clubItemsDimmed(): boolean
    {
        return GetConfiguration<boolean>('avatareditor.show.clubitems.dimmed', true);
    }
}
