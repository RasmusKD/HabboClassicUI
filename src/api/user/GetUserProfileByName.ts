import { GetExtendedProfileByNameMessageComposer } from '@nitrots/nitro-renderer';
import { SendMessageComposer } from '..';

export function GetUserProfileByName(username: string): void
{
    SendMessageComposer(new GetExtendedProfileByNameMessageComposer(username));
}
