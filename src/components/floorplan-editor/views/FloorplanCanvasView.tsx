import { GetOccupiedTilesMessageComposer, GetRoomEntryTileMessageComposer, NitroPoint, RoomEntryTileMessageEvent, RoomOccupiedTilesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { SendMessageComposer } from '../../../api';
import { Base, Button, classNames, Column, ColumnProps, Flex, Grid } from '../../../common';
import { useMessageEvent } from '../../../hooks';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../FloorplanEditorContext';

export const FloorplanCanvasView: FC<ColumnProps> = props =>
{
    const { gap = 1, children = null, ...rest } = props;
    const [ occupiedTilesReceived , setOccupiedTilesReceived ] = useState(false);
    const [ entryTileReceived, setEntryTileReceived ] = useState(false);
    const { originalFloorplanSettings = null, setOriginalFloorplanSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext();
    const elementRef = useRef<HTMLDivElement>(null);
    const [ zoomedIn, setZoomedIn ] = useState(false);

    const toggleZoom = () =>
    {
        const zoomFactor = zoomedIn ? 2 : 0.5;
        const element = elementRef.current;
        const currentScrollX = element.scrollLeft;
        const currentScrollY = element.scrollTop;

        const relativeScrollX = currentScrollX / (element.scrollWidth - element.clientWidth);
        const relativeScrollY = currentScrollY / (element.scrollHeight - element.clientHeight);

        setZoomedIn(!zoomedIn);

        const newScrollX = relativeScrollX * (element.scrollWidth - element.clientWidth);
        const newScrollY = relativeScrollY * (element.scrollHeight - element.clientHeight);

        element.scrollTo(newScrollX, newScrollY);
    };

    useMessageEvent<RoomOccupiedTilesMessageEvent>(RoomOccupiedTilesMessageEvent, event =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.reservedTiles = parser.blockedTilesMap;

            FloorplanEditor.instance.setTilemap(newValue.tilemap, newValue.reservedTiles);

            return newValue;
        });

        setOccupiedTilesReceived(true);

        elementRef.current.scrollTo(
            (FloorplanEditor.instance.renderer.canvas.width - elementRef.current.clientWidth) / 2, 0);
    });

    useMessageEvent<RoomEntryTileMessageEvent>(RoomEntryTileMessageEvent, event =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.entryPoint = [ parser.x, parser.y ];
            newValue.entryPointDir = parser.direction;

            return newValue;
        });

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.entryPointDir = parser.direction;

            return newValue;
        });

        FloorplanEditor.instance.doorLocation = new NitroPoint(parser.x, parser.y);

        setEntryTileReceived(true);
    });

    const onPointerEvent = (event: PointerEvent) =>
    {
        event.preventDefault();

        switch(event.type)
        {
            case 'pointerout':
            case 'pointerup':
                FloorplanEditor.instance.onPointerRelease();
                break;
            case 'pointerdown':
                FloorplanEditor.instance.onPointerDown(event);
                break;
            case 'pointermove':
                FloorplanEditor.instance.onPointerMove(event);
                break;
        }
    }

    useEffect(() =>
    {
        return () =>
        {
            FloorplanEditor.instance.clear();

            setVisualizationSettings(prevValue =>
            {
                return {
                    wallHeight: originalFloorplanSettings.wallHeight,
                    thicknessWall: originalFloorplanSettings.thicknessWall,
                    thicknessFloor: originalFloorplanSettings.thicknessFloor,
                    entryPointDir: prevValue.entryPointDir
                }
            });
        }
    }, [ originalFloorplanSettings.thicknessFloor, originalFloorplanSettings.thicknessWall, originalFloorplanSettings.wallHeight, setVisualizationSettings ]);

    useEffect(() =>
    {
        if(!entryTileReceived || !occupiedTilesReceived) return;

        FloorplanEditor.instance.renderTiles();
    }, [ entryTileReceived, occupiedTilesReceived ]);

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomEntryTileMessageComposer());
        SendMessageComposer(new GetOccupiedTilesMessageComposer());

        const currentElement = elementRef.current;

        if(!currentElement) return;

        // @ts-ignore
        currentElement.appendChild(FloorplanEditor.instance.renderer.canvas);

        currentElement.addEventListener('pointerup', onPointerEvent);

        currentElement.addEventListener('pointerout', onPointerEvent);

        currentElement.addEventListener('pointerdown', onPointerEvent);

        currentElement.addEventListener('pointermove', onPointerEvent);

        return () =>
        {
            if(currentElement)
            {
                currentElement.removeEventListener('pointerup', onPointerEvent);

                currentElement.removeEventListener('pointerout', onPointerEvent);

                currentElement.removeEventListener('pointerdown', onPointerEvent);

                currentElement.removeEventListener('pointermove', onPointerEvent);
            }
        }
    }, []);

    return (
        <Column gap={ gap } { ...rest } position="relative">
            <Column overflow="hidden">
                <Base overflow="auto" innerRef={ elementRef } />
                <Base className="floorplan-square" />
            </Column>
            { children }
            <Flex position="absolute" className="bottom-4 start-2">
                <Base pointer onClick={ toggleZoom } className={ classNames('icon', zoomedIn && 'icon-zoom-less', !zoomedIn && 'icon-zoom-more') } />
            </Flex>
        </Column>
    );
};
