import { IMessageComposer } from '../../../../../../api';

export class UserSettingsArrowKeysComposer implements IMessageComposer<ConstructorParameters<typeof UserSettingsArrowKeysComposer>>
{
    private _data: ConstructorParameters<typeof UserSettingsArrowKeysComposer>;

    constructor(value: int)
    {
        this._data = [value];
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
