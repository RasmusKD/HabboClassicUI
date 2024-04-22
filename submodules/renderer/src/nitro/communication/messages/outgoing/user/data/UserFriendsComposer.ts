import { IMessageComposer } from '../../../../../../api';

export class UserFriendsComposer implements IMessageComposer<ConstructorParameters<typeof UserFriendsComposer>>
{
    private _data: ConstructorParameters<typeof UserFriendsComposer>;

    constructor(userId: number)
    {
        this._data = [userId];
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
