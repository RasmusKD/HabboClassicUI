import { GetOccupiedTilesMessageComposer, GetRoomEntryTileMessageComposer, NitroPoint, RoomEntryTileMessageEvent, RoomOccupiedTilesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { SendMessageComposer } from '../../../api';
import { Base, Button, Column, ColumnProps, Flex, Grid } from '../../../common';
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
    const [zoomedIn, setZoomedIn] = useState(false);

   const toggleZoom = () => {
     const zoomFactor = zoomedIn ? 2 : 0.5;
     const element = elementRef.current;
     const currentScrollX = element.scrollLeft;
     const currentScrollY = element.scrollTop;

     // Store the scrollbar's relative position (0 to 1) before zooming
     const relativeScrollX = currentScrollX / (element.scrollWidth - element.clientWidth);
     const relativeScrollY = currentScrollY / (element.scrollHeight - element.clientHeight);

     // Apply the zoom
     FloorplanEditor.instance.toggleZoom();
     setZoomedIn(!zoomedIn);

     // Calculate new scroll positions based on the relative scrollbar positions
     const newScrollX = relativeScrollX * (element.scrollWidth - element.clientWidth);
     const newScrollY = relativeScrollY * (element.scrollHeight - element.clientHeight);

     // Scroll to the new positions
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

        elementRef.current.scrollTo((FloorplanEditor.instance.view.width / 3), 0);
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

        FloorplanEditor.instance.tilemapRenderer.interactive = true;

        if(!elementRef.current) return;

        elementRef.current.appendChild(FloorplanEditor.instance.renderer.view);
    }, []);

    useEffect(() =>
    {
        FloorplanEditor.instance.tilemapRenderer.interactive = true;
    }, [zoomedIn]);

    return (
        <Column gap={gap} {...rest}>
              <Column overflow="hidden">
                <Base overflow="auto" innerRef={elementRef} />
              </Column>
              {children}
              <Flex>
                <Button onClick={toggleZoom}>{zoomedIn ? 'Zoom In' : 'Zoom Out'}</Button>
              </Flex>
            </Column>
      );
    };
