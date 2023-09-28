import { FC, useEffect, useState } from 'react';
import { GetConfiguration } from '../../../../../api';
import { RoomWidgetViewNight } from '../rooms/RoomWidgetViewNight';
import { RoomWidgetView } from '../rooms/RoomWidgetView';
export const MoodEvening: FC<{}> = props =>
{


    const backgroundColor = GetConfiguration('hotelview')['images']['background.colour'];
    const assetUrl = GetConfiguration<string>('asset.url');
    const [show, setShow] = useState(false)
    const [landing, setLanding] = useState(false)
        useEffect(() => {
            setTimeout(() => setShow(true), 7000);
            setTimeout(() => setLanding(true), 0);
        }, []);
        const now = new Date();
        const nineteen  = now.getHours() == 18 && now.getMinutes() <= 30;
        const nineteenhalf = now.getHours() == 18 && now.getMinutes() >= 30;
        const twentie  = now.getHours() == 19 && now.getMinutes() <= 30;
        const twentiehalf = now.getHours() == 19 && now.getMinutes() >= 30;
        const twentieone  = now.getHours() == 20 && now.getMinutes() <= 30;
        const twentieonehalf = now.getHours() == 20 && now.getMinutes() >= 30;
        const twentietwo  = now.getHours() == 21 && now.getMinutes() <= 30;
        const twentietwohalf = now.getHours() == 21 && now.getMinutes() >= 30;
        const twentiethree  = now.getHours() == 22 && now.getMinutes() <= 30;
        const twentiethreehalf = now.getHours() == 22 && now.getMinutes() >= 30;

    //morning
    if(nineteen)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-a position-absolute"/>
         </div>
        </div>
        </div>         );
    if(nineteenhalf)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-a position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentie)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-a position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentiehalf)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-a position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentieone)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-a position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentieonehalf)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-b position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentietwo)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-b position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentietwohalf)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-b position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentiethree)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-b position-absolute"/>
         </div>
        </div>
        </div>         );
    if(twentiethreehalf)
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-b position-absolute"/>
         </div>
        </div>
        </div>         );
    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

                // Fundo
        <div className="left position-absolute">
        <div className="hotelview-back position-relative">
        <div className="stretch-blue-night position-relative"/>
        </div>
        </div>

                // Iluminação-fundo
                <div className="left position-relative">
            <div className="hotelview-back-light position-relative">
        <div className="back-c position-absolute"/>

        </div>
        </div>
                // Hotel
        <div className="left position-absolute">
        <div className="hotelview position-relative">
        <div className="hotelview-night position-relative"/>
            <RoomWidgetViewNight/>
                // Iluminação
                <div className="light-i position-absolute"/>

                <div className="door position-absolute"/>
                <div className="door-b position-absolute"/>
         </div>
        </div>
        </div>         );

}
