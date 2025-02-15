import { FC, useEffect, useState } from 'react';
import { GetConfiguration } from '../../../../../api';
import { RoomWidgetView } from '../rooms/RoomWidgetView';
import { RoomWidgetViewNight } from '../rooms/RoomWidgetViewNight';

export const MoodNight: FC<{}> = props =>
{

    const [show, setShow] = useState(false)
    const backgroundColor = GetConfiguration('hotelview')['images']['background.colour'];
    const assetUrl = GetConfiguration<string>('asset.url');

    const now = new Date();

        useEffect(() => {
            setTimeout(() => setShow(true), 15000);
        }, []);


    //morning
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

            <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
         </div>
        </div>
        </div>         );
            }