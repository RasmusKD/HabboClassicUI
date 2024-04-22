import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';
import { FriendsStatusInfo } from './FriendsStatusInfo';

export class FriendsStatusInfoMessageParser implements IMessageParser
{
    private _userId: number;
    private _friendsList: FriendsStatusInfo[] = [];

    public flush(): boolean
    {
        this._userId = 0;
        this._friendsList = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._userId = wrapper.readInt();

        const friendsCount = wrapper.readInt();

        for(let i = 0; i < friendsCount; i++)
        {
            const friend = new FriendsStatusInfo(wrapper);
            this._friendsList.push(friend);
        }

        return true;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get friendsList(): FriendsStatusInfo[]
    {
        return this._friendsList;
    }
}
