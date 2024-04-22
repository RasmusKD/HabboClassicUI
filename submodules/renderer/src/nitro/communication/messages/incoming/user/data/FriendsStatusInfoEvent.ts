import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { FriendsStatusInfoMessageParser } from '../../../parser';

export class FriendsStatusInfoEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FriendsStatusInfoMessageParser);
    }

    public getParser(): FriendsStatusInfoMessageParser
    {
        return this.parser as FriendsStatusInfoMessageParser;
    }
}
