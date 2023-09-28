import { IPartColor } from '@nitrots/nitro-renderer';
import { AvatarEditorColorPicker } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';

export class CategoryData
{
    private _name: string;
    private _parts: AvatarEditorGridPartItem[];
    private _colorPickers: AvatarEditorColorPicker[];
    private _selectedPartIndex: number = -1;

    constructor(name: string, partItems: AvatarEditorGridPartItem[], colorPickers: AvatarEditorColorPicker[])
    {
        this._name = name;
        this._parts = partItems;
        this._colorPickers = colorPickers;
        this._selectedPartIndex = -1;
    }

    private static defaultHexColor(): string
    {

        return '000000';
    }

    public init(): void
    {
        for(const part of this._parts)
        {
            if(!part) continue;

            part.init();
        }
    }

    public dispose(): void
    {
        if(this._parts)
        {
            for(const part of this._parts) part.dispose();

            this._parts = null;
        }

        if(this._colorPickers)
        {
            this._colorPickers = null;
        }

        this._selectedPartIndex = -1;
    }

    public selectPartId(partId: number): void
    {
        if(!this._parts) return;

        let i = 0;

        while(i < this._parts.length)
        {
            const partItem = this._parts[i];

            if(partItem.id === partId)
            {
                this.selectPartIndex(i);

                return;
            }

            i++;
        }
    }

    public selectHexColors(hexColors: string[]): void
    {
        if(!hexColors || !this._colorPickers) return;



        let i = 0;

        while(i < this._colorPickers.length)
        {
            const colorPicker = this._colorPickers[i];

            colorPicker.color = hexColors[i];

            i++;
        }

        this.updatePartColors();
    }

    public selectPartIndex(partIndex: number): AvatarEditorGridPartItem
    {
        if(!this._parts) return null;

        if((this._selectedPartIndex >= 0) && (this._parts.length > this._selectedPartIndex))
        {
            const partItem = this._parts[this._selectedPartIndex];

            if(partItem) partItem.isSelected = false;
        }

        if(this._parts.length > partIndex)
        {
            const partItem = this._parts[partIndex];

            if(partItem)
            {
                partItem.isSelected = true;

                this._selectedPartIndex = partIndex;

                return partItem;
            }
        }

        return null;
    }

    public selectColor(color: string, colorPickerIndex: number): AvatarEditorColorPicker
    {
        const colorPicker = this.getColorPicker(colorPickerIndex);
        colorPicker.color = color;

        this.updatePartColors();

        return colorPicker;
    }

    public getSelectedHexColors(): string[]
    {
        return this._colorPickers.map(colorPicker => colorPicker.partColor.rgb.toString(16))
    }

    private getSelectedColors(): IPartColor[]
    {
        const partColors: IPartColor[] = [];

        let i = 0;

        while(i < this._colorPickers.length)
        {
            const colorPicker = this.getSelectedColor(i);

            if(colorPicker)
            {
                partColors.push(colorPicker.partColor);
            }
            else
            {
                partColors.push(null);
            }

            i++;
        }

        return partColors;
    }

    public getSelectedColor(colorPickerIndex: number): AvatarEditorColorPicker
    {
        const colorPicker = this.getColorPicker(colorPickerIndex);

        if(!colorPicker) return null;

        return colorPicker;
    }

    public getSelectedHexColor(paletteId: number): string
    {
        const colorItem = this.getSelectedColor(paletteId);

        if(colorItem && (colorItem.partColor)) return colorItem.partColor.rgb.toString(16);

        return '000000';
    }

    public getColorPicker(index: number): AvatarEditorColorPicker
    {
        if(!this._colorPickers || (this._colorPickers.length <= index))
        {
            return null;
        }

        return this._colorPickers[index];
    }

    public getCurrentPart(): AvatarEditorGridPartItem
    {
        return this._parts[this._selectedPartIndex] as AvatarEditorGridPartItem;
    }

    public updatePartColors(): void
    {
        const partColors = this.getSelectedColors();

        for(const partItem of this._parts)
        {
            if(partItem) partItem.partColors = partColors;
        }
    }

    public hasClubSelectionsOverLevel(level: number): boolean
    {
        let hasInvalidSelections = false;

        const partColors = this.getSelectedColors();

        if(partColors)
        {
            let i = 0;

            while(i < partColors.length)
            {
                const partColor = partColors[i];

                if(partColor) hasInvalidSelections = true;

                i++;
            }
        }

        const partItem = this.getCurrentPart();

        if(partItem && partItem.partSet)
        {
            const partSet = partItem.partSet;

            if(partSet && (partSet.clubLevel > level)) hasInvalidSelections = true;
        }

        return hasInvalidSelections;
    }

    public hasInvalidSelectedItems(ownedItems: number[]): boolean
    {
        const part = this.getCurrentPart();

        if(!part) return false;

        const partSet = part.partSet;

        if(!partSet || !partSet.isSellable) return;

        return (ownedItems.indexOf(partSet.id) > -1);
    }

    public stripClubItemsOverLevel(level: number): boolean
    {
        const partItem = this.getCurrentPart();

        if(partItem && partItem.partSet)
        {
            const partSet = partItem.partSet;

            if(partSet.clubLevel > level)
            {
                const newPartItem = this.selectPartIndex(0);

                if(newPartItem && !newPartItem.partSet) this.selectPartIndex(1);

                return true;
            }
        }

        return false;
    }

    public stripClubColorsOverLevel(): boolean
    {
        const hexColors: string[] = [];
        const partColors = this.getSelectedColors();

        let didStrip = false;

        const hexColor = CategoryData.defaultHexColor();

        let i = 0;

        while(i < partColors.length)
        {
            const partColor = partColors[i];

            if(!partColor)
            {
                hexColors.push(hexColor);

                didStrip = true;
            }
            else
            {
                hexColors.push(partColor.rgb.toString(16));
            }

            i++;
        }

        if(didStrip) this.selectHexColors(hexColors);

        return didStrip;
    }

    // public stripInvalidSellableItems(k:IHabboInventory): boolean
    // {
    //     var _local_3:IFigurePartSet;
    //     var _local_4:AvatarEditorGridPartItem;
    //     var _local_2:AvatarEditorGridPartItem = this._Str_6315();
    //     if (((_local_2) && (_local_2.partSet)))
    //     {
    //         _local_3 = _local_2.partSet;
    //         if (((_local_3.isSellable) && (!(k._Str_14439(_local_3.id)))))
    //         {
    //             _local_4 = this._Str_8066(0);
    //             if (((!(_local_4 == null)) && (_local_4.partSet == null)))
    //             {
    //                 this._Str_8066(1);
    //             }
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    public get name(): string
    {
        return this._name;
    }

    public get parts(): AvatarEditorGridPartItem[]
    {
        return this._parts;
    }

    public get selectedPartIndex(): number
    {
        return this._selectedPartIndex;
    }
}
