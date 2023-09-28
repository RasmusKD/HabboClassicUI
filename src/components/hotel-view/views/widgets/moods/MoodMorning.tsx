import { FC } from 'react';
import { GetConfiguration } from '../../../../../api';
import { RoomWidgetViewNight } from './../../../views/widgets/rooms/RoomWidgetViewNight';
import { RoomWidgetView } from './../../../views/widgets/rooms/RoomWidgetView';

export const MoodMorning: FC<{}> = props =>
{

    const backgroundColor = GetConfiguration('hotelview')['images']['background.colour'];
    const assetUrl = GetConfiguration<string>('asset.url');

    const now = new Date();
    const six = now.getHours() == 6 && now.getMinutes() <= 30;
    const sixhalf = now.getHours() == 6 && now.getMinutes() >= 30;
    const seven = now.getHours() == 7 && now.getMinutes() <= 30;
    const sevenhalf = now.getHours() == 7 && now.getMinutes() >= 30;
    const eight = now.getHours() == 8 && now.getMinutes() <= 30;
    const eighthalf = now.getHours() == 8 && now.getMinutes() >= 30;
    const nine = now.getHours() == 9 && now.getMinutes() <= 30;
    const ninehalf = now.getHours() == 9 && now.getMinutes() >= 30;
    const ten = now.getHours() == 10 && now.getMinutes() <= 30;

    const sixteen = now.getHours() == 16 && now.getMinutes() <= 30;
    const sixteenhalf = now.getHours() == 16 && now.getMinutes() >= 30;
    const seventeen  = now.getHours() == 17 && now.getMinutes() <= 30;
    const seventeenhalf = now.getHours() == 17 && now.getMinutes() >= 30;
    const eighteen = now.getHours() == 18 && now.getMinutes() <= 30;
    const eighteenhalf = now.getHours() == 18 && now.getMinutes() >= 30;
    const nineteen  = now.getHours() == 19 && now.getMinutes() <= 30;
    const nineteenhalf = now.getHours() == 19 && now.getMinutes() >= 30;

if (ten)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
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
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="light-i position-absolute"/>


     </div>
    </div>
    </div>         );
if(ninehalf)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
            <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
    <div className="back-e position-absolute"/>
    <div className="back-e position-absolute"/>

    <div className="back-d position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação


            <div className="light-gg-alt position-absolute"/>
            <div className="light-g position-absolute"/>


     </div>
    </div>
    </div>         );
if(nine)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
            <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
    <div className="back-e position-absolute"/>
    <div className="back-e position-absolute"/>

    <div className="back-d position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="front-d position-absolute"/>


            <div className="light-gg-alt position-absolute"/>
            <div className="light-g position-absolute"/>
            <div className="light-g position-absolute"/>


     </div>
    </div>
    </div>         );
if(eighthalf)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
            <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
    <div className="back-e position-absolute"/>
    <div className="back-d position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="front-c position-absolute"/>
            <div className="front-c position-absolute"/>
            <div className="front-c position-absolute"/>

            <div className="light-f position-absolute"/>


     </div>
    </div>
    </div>         );
if(eight)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
            <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
    <div className="back-e position-absolute"/>
    <div className="back-d position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="front-c position-absolute"/>
            <div className="front-c position-absolute"/>
            <div className="front-c position-absolute"/>
            <div className="front-c position-absolute"/>
            <div className="light-e  position-absolute"/>


     </div>
    </div>
    </div>         );
if(sevenhalf)
return (

<div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

        // Fundo
<div className="left position-absolute">
<div className="hotelview-back position-relative">
     <div className="stretch-blue position-relative"/>
</div>
</div>

        // Iluminação-fundo
        <div className="left position-relative">
    <div className="hotelview-back-light position-relative">
<div className="back-d position-absolute"/>
<div className="back-c position-absolute"/>
<div className="back-b position-absolute"/>
</div>
</div>
        // Hotel
<div className="left position-absolute">
<div className="hotelview position-relative">
    <div className="hotelview-orange position-relative"/>
    <RoomWidgetView/>
        // Iluminação

        <div className="front-c position-absolute"/>
        <div className="front-b position-absolute"/>
        <div className="light-d position-absolute"/>
 </div>
</div>
</div>         );
if(seven)
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
    <div className="back-a-alt position-absolute"/>
    <div className="back-c-alt position-absolute"/>
    <div className="back-b position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="front-c position-absolute"/>
            <div className="front-b position-absolute"/>
            <div className="light-b position-absolute"/>
     </div>
    </div>
    </div>         );
if(sixhalf)
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
    <div className="back-a-alt position-absolute"/>
    <div className="back-a-alt position-absolute"/>
    <div className="back-b position-absolute"/>
    </div>
    </div>
    // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
    <div className="hotelview-orange position-relative"/>
    <RoomWidgetView/>
    // Iluminação
    <div className="front-a position-absolute"/>
    <div className="light-a position-absolute"/>
    </div>
    </div>
    </div>         );
if(six)
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
<div className="back-a position-relative"/>
<div className="back-a position-absolute"/>
</div>
</div>
    // Hotel
<div className="left position-absolute">
<div className="hotelview position-relative">
<div className="hotelview-night position-relative"/>
<RoomWidgetViewNight/>
    // Iluminação
    <div className="light-a position-absolute"/>
    <div className="light-a position-absolute"/>
</div>
</div>
</div>         );

if(sixteen)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
            <div className="left position-relative">
        <div className="hotelview-back-light position-relative">

        <div className="back-f-alt position-absolute"/>

    <div className="back-f position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação


            <div className="front-j position-absolute"/>
            <div className="light-j position-absolute"/>
            <div className="light-j position-absolute"/>


     </div>
    </div>
    </div>         );
if(sixteenhalf)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
    <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
        <div className="back-g-alt position-absolute"/>
        <div className="back-g position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação

            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="light-l position-absolute"/>
            <div className="light-l-alt position-absolute"/>


     </div>
    </div>
    </div>         );

if(seventeen)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue-af-2 position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
    <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
        <div className="back-h-alt position-absolute"/>
        <div className="back-h position-absolute"/>

    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>

            <div className="light-m position-absolute"/>
            <div className="light-m-alt position-absolute"/>


     </div>
    </div>
    </div>         );
if(seventeenhalf)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue-af-2 position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
    <div className="left position-relative">
        <div className="hotelview-back-light position-relative">

        <div className="back-h position-absolute"/>
        <div className="back-i-alt position-absolute"/>

        <div className="back-i position-absolute"/>
    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação

            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>

            <div className="light-n position-absolute"/>
            <div className="light-n-alt position-absolute"/>


     </div>
    </div>
    </div>         );
if(eighteen)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue-af-4 position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
    <div className="left position-relative">
        <div className="hotelview-back-light position-relative">

        <div className="back-f position-absolute"/>

        <div className="back-h position-absolute"/>
        <div className="back-j-alt position-absolute"/>
        <div className="back-i position-absolute"/>

    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação

            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>

            <div className="light-n position-absolute"/>
            <div className="light-n-alt-iii position-absolute"/>

     </div>
    </div>
    </div>         );
if(eighteenhalf)
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue-af-4 position-relative"/>
    </div>
    </div>

            // Iluminação-fundo
    <div className="left position-relative">
        <div className="hotelview-back-light position-relative">
        <div className="back-f position-absolute"/>
        <div className="back-h position-absolute"/>
        <div className="back-k-alt position-absolute"/>
        <div className="back-i position-absolute"/>

    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação

            <div className="front-l position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>

            <div className="light-o position-absolute"/>
            <div className="light-o-alt position-absolute"/>
            <div className="light-o-alt-ii position-absolute"/>

     </div>
    </div>
    </div>         );
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
        <div className="back-c-alt position-absolute"/>
        <div className="back-h position-absolute"/>
        <div className="back-k-alt position-absolute"/>


    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação

            <div className="front-m position-absolute"/>
            <div className="front-m position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>
            <div className="front-j position-absolute"/>

            <div className="light-p position-absolute"/>
            <div className="light-p-alt position-absolute"/>
            <div className="light-p-alt-ii position-absolute"/>

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
        <div className="back-l position-absolute"/>
        <div className="back-l position-absolute"/>
        <div className="back-l position-absolute"/>

    </div>
    </div>
            // Hotel
    <div className="left position-absolute">
    <div className="hotelview position-relative">
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="front-a position-absolute"/>

            <div className="light-q position-absolute"/>
            <div className="light-q-alt-ii position-absolute"/>

     </div>
    </div>
    </div>         );
return (

    <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>

            // Fundo
    <div className="left position-absolute">
    <div className="hotelview-back position-relative">
         <div className="stretch-blue position-relative"/>
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
        <div className="hotelview-orange position-relative"/>
        <RoomWidgetView/>
            // Iluminação
            <div className="light-i position-absolute"/>


     </div>
    </div>
    </div>         );
}
