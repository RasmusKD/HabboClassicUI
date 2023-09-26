import { FC, useCallback, useEffect, useRef } from 'react';
import { GetSessionDataManager, DispatchMouseEvent, DispatchTouchEvent, GetNitroInstance } from '../../api';
import { Base } from '../../common';
import { useRoom } from '../../hooks';
import { RoomSpectatorView } from './spectator/RoomSpectatorView';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

export const RoomView: FC<{}> = props =>
{
    const { roomSession = null } = useRoom();
    const elementRef = useRef<HTMLDivElement>();

    const onKeyDownEvent = useCallback((event: KeyboardEvent) =>
    {   console.log(GetSessionDataManager());  // Debugging here
    console.log(typeof GetSessionDataManager().arrowKeys);  // Debugging here
    console.log("Session Data Manager arrowKeys", GetSessionDataManager().arrowKeys);  // Debug Log
        if (GetSessionDataManager().arrowKeys !== 2) return;
        switch(event.key) {
            case 'ArrowLeft':
                roomSession.sendMovementMessage(1);
                return;
            case 'ArrowRight':
                roomSession.sendMovementMessage(2);
                return;
            case 'ArrowUp':
                roomSession.sendMovementMessage(3);
                return;
            case 'ArrowDown':
                roomSession.sendMovementMessage(4);
                return;
            default:
                return;
    }
    }, [ roomSession ]);

    useEffect(() =>
    {   console.log('useEffect for keyboard events is running');
        document.body.addEventListener('keydown', onKeyDownEvent);

        return () =>
        {
            document.body.removeEventListener('keydown', onKeyDownEvent);
        }
    }, [ onKeyDownEvent ]);

    useEffect(() =>
    {
        const canvas = GetNitroInstance().application.renderer.view;

        if(!canvas) return;

        canvas.onclick = event => DispatchMouseEvent(event);
        canvas.onmousemove = event => DispatchMouseEvent(event);
        canvas.onmousedown = event => DispatchMouseEvent(event);
        canvas.onmouseup = event => DispatchMouseEvent(event);

        canvas.ontouchstart = event => DispatchTouchEvent(event);
        canvas.ontouchmove = event => DispatchTouchEvent(event);
        canvas.ontouchend = event => DispatchTouchEvent(event);
        canvas.ontouchcancel = event => DispatchTouchEvent(event);

        const element = elementRef.current;

        if(!element) return;

        element.appendChild(canvas);
    }, []);

    return (
        <Base fit innerRef={ elementRef } className={ (!roomSession && 'd-none') }>
            { roomSession &&
                <>
                    <RoomWidgetsView />
                    { roomSession.isSpectator && <RoomSpectatorView /> }
                </> }
        </Base>
    );
}
