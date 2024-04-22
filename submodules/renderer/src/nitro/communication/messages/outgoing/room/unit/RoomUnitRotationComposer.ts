import { IMessageComposer } from '../../../../../../api';

export class RoomUnitRotationComposer implements IMessageComposer<ConstructorParameters<typeof RoomUnitPostureComposer>>
{
    private _data: ConstructorParameters<typeof RoomUnitRotationComposer>;

    constructor(rotation: number)
    {
        this._data = [rotation];
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
