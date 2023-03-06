import { FC } from 'react';
import { CreateLinkEvent, GetConfiguration } from '../../../../../api';
import { Base, Flex } from '../../../../../common';


export interface RoomWidgetViewProps
{
}

export const RoomWidgetView: FC<RoomWidgetViewProps> = props =>
{
    const poolId = GetConfiguration<string>('hotelview')['room.pool'];
    const picnicId = GetConfiguration<string>('hotelview')['room.picnic'];
    const rooftopId = GetConfiguration<string>('hotelview')['room.rooftop'];
    const rooftopPoolId = GetConfiguration<string>('hotelview')['room.rooftop.pool'];
    const peacefulId = GetConfiguration<string>('hotelview')['room.peaceful'];
    const infobusId = GetConfiguration<string>('hotelview')['room.infobus'];
    const lobbyId = GetConfiguration<string>('hotelview')['room.lobby'];



    return (
        <Flex>
            <Base className="rooftop position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 645) }>
                <i className="active-arrow arrow"/>
            </Base>
            <Base className="rooftop-pool position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 644) }>
                <i className="active-arrow arrow"/>
            </Base>
            <Base className="pool position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 582) }>
                <i className="active-arrow arrow"/>
            </Base>
            <Base className="picnic position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 82) }>
                <i className="active-arrow arrow"/>
            </Base>
            <Base className="peaceful position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 124) }>
                <i className="active-arrow arrow"/>
            </Base>
            <Base className="infobus position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 609) }>
                <i className="active-arrow arrow"/>
            </Base>
            <Base className="lobby position-absolute" onClick={ event => CreateLinkEvent('navigator/goto/' + 45) }>
                <i className="active-arrow arrow"/>
            </Base>
        </Flex>

    );
}
