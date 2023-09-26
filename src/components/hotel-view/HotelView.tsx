import { NitroConfiguration, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useState, useCallback } from 'react';
import { GetConfiguration, GetConfigurationManager } from '../../api';
import { LayoutAvatarImageView } from '../../common';
import { useNitroEvent, useSessionInfo } from '../../hooks';
import { MoodEvening } from './views/widgets/moods/MoodEvening';
import { MoodMorning } from './views/widgets/moods/MoodMorning';
import { MoodNight } from './views/widgets/moods/MoodNight';
import { WidgetView } from './WidgetView';

const widgetSlotCount = 7;

export const HotelView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true);
    const { userFigure = null } = useSessionInfo();

    const now = new Date();
    const isMorning   = now.getHours() > 5  && now.getHours() <= 19;
    const isEvening   = now.getHours() > 19 && now.getHours() <= 23;
    const isNight     = now.getHours() > 23 || now.getHours() <= 5;

    useNitroEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED ], event =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setIsVisible(false);
                return;
            case RoomSessionEvent.ENDED:
                setIsVisible(event.openLandingView);
                return;
        }
    });

    if(!isVisible) return null;


     // Morning

     if (isMorning)
     return (
         <div>
         <WidgetView/>
             <MoodMorning/>

         </div>
     );

     if (isEvening)
     return (
         <div>
         <WidgetView/>
             <MoodEvening/>

         </div>
     );

     if (isNight)
     return (
         <div>
         <WidgetView/>
             <MoodNight/>

         </div>
     );
      }

