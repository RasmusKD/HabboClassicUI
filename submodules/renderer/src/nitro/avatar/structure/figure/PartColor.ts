import { IPartColor } from '../../../../api';

export class PartColor implements IPartColor
{
    private _rgb: number;

    constructor(hexColor: string)
    {
        if(!hexColor) hexColor = '000000';

        this._rgb = parseInt('0x' + hexColor, 16);
    }

    public get rgb(): number
    {
        return this._rgb;
    }
}
