import { ColorConverter, IPartColor, PartColor } from '@nitrots/nitro-renderer';

export class AvatarEditorColorPicker
{
    private _selectedPartColor: IPartColor;
    private _isHC: boolean;
    private _notifier: () => void;

    constructor(partColor: IPartColor)
    {
        this._selectedPartColor = partColor;
        this._isHC = true;
    }

    public dispose(): void
    {
        this._selectedPartColor = null;
    }

    public get partColor(): IPartColor
    {
        return this._selectedPartColor;
    }

    public get rgb(): string
    {
        return ColorConverter.int2rgb(this._selectedPartColor.rgb);
    }

    public get isHC(): boolean
    {
        return this._isHC;
    }

    public set color(hexColor: string)
    {
        this._selectedPartColor = new PartColor(hexColor);

        if(this.notify) this.notify();
    }

    public set partColor(partColor: IPartColor)
    {
        this._selectedPartColor = partColor;

        if(this.notify) this.notify();
    }

    public get notify(): () => void
    {
        return this._notifier;
    }

    public set notify(notifier: () => void)
    {
        this._notifier = notifier;
    }
}
