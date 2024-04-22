import { IMessageComposer } from '../../../../../../api';

export class RoomUnitMovementComposer implements IMessageComposer<ConstructorParameters<typeof RoomUnitPostureComposer>>
{
    private _data: ConstructorParameters<typeof RoomUnitMovementComposer>;

    constructor(direction: number)
    {
        this._data = [direction];
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
