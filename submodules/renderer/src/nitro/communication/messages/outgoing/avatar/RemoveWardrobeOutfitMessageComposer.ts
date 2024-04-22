import { IMessageComposer } from '../../../../../api';

export class RemoveWardrobeOutfitMessageComposer implements IMessageComposer<ConstructorParameters<typeof RemoveWardrobeOutfitMessageComposer>>
{
    private _data: ConstructorParameters<typeof RemoveWardrobeOutfitMessageComposer>;

    constructor(slotId: number)
    {
        this._data = [slotId];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
