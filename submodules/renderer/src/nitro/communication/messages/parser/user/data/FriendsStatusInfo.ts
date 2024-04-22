export class FriendsStatusInfo
{
    private _friendId: number;
    private _friendName: string;
    private _friendFigure: string;
    private _friendRelation: number;
    private _friendOnline: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._friendId = 0;
        this._friendName = null;
        this._friendFigure = null;
        this._friendRelation = 0;
        this._friendOnline = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._friendId = wrapper.readInt();
        this._friendName = wrapper.readString();
        this._friendFigure = wrapper.readString();
        this._friendRelation = wrapper.readShort();
        this._friendOnline = wrapper.readInt();

        return true;
    }

    public get friendId(): number
    {
        return this._friendId;
    }

    public get friendName(): string
    {
        return this._friendName;
    }

    public get friendFigure(): string
    {
        return this._friendFigure;
    }

    public get friendRelation(): number
    {
        return this._friendRelation;
    }

    public get friendOnline(): number
    {
        return this._friendOnline;
    }
}
