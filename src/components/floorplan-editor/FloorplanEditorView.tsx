import { FloorHeightMapEvent, ILinkEventTracker, NitroPoint, RoomEngineEvent, RoomVisualizationSettingsEvent, UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { Base, Button, ButtonGroup, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useMessageEvent, useNitroEvent } from '../../hooks';
import { FloorplanEditorContextProvider } from './FloorplanEditorContext';
import { FloorplanEditor } from './common/FloorplanEditor';
import { IFloorplanSettings } from './common/IFloorplanSettings';
import { IVisualizationSettings } from './common/IVisualizationSettings';
import { convertNumbersForSaving, convertSettingToNumber } from './common/Utils';
import { FloorplanCanvasView } from './views/FloorplanCanvasView';
import { FloorplanImportExportView } from './views/FloorplanImportExportView';
import { FloorplanOptionsView } from './views/FloorplanOptionsView';

export const FloorplanEditorView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ importExportVisible, setImportExportVisible ] = useState(false);
    const [ originalFloorplanSettings, setOriginalFloorplanSettings ] = useState<IFloorplanSettings>({
        tilemap: '',
        reservedTiles: [],
        entryPoint: [ 0, 0 ],
        entryPointDir: 2,
        wallHeight: -1,
        thicknessWall: 1,
        thicknessFloor: 1
    });
    const [ visualizationSettings, setVisualizationSettings ] = useState<IVisualizationSettings>({
        entryPointDir: 2,
        wallHeight: -1,
        thicknessWall: 1,
        thicknessFloor: 1
    });

    const saveFloorChanges = () =>
    {
        SendMessageComposer(new UpdateFloorPropertiesMessageComposer(
            FloorplanEditor.instance.getCurrentTilemapString(),
            FloorplanEditor.instance.doorLocation.x,
            FloorplanEditor.instance.doorLocation.y,
            visualizationSettings.entryPointDir,
            convertNumbersForSaving(visualizationSettings.thicknessWall),
            convertNumbersForSaving(visualizationSettings.thicknessFloor),
            (visualizationSettings.wallHeight - 1)
        ));
    }

    const revertChanges = () =>
    {
        setVisualizationSettings({ wallHeight: originalFloorplanSettings.wallHeight, thicknessWall: originalFloorplanSettings.thicknessWall, thicknessFloor: originalFloorplanSettings.thicknessFloor, entryPointDir: originalFloorplanSettings.entryPointDir });
        
        FloorplanEditor.instance.doorLocation = new NitroPoint(originalFloorplanSettings.entryPoint[0], originalFloorplanSettings.entryPoint[1]);
        FloorplanEditor.instance.setTilemap(originalFloorplanSettings.tilemap, originalFloorplanSettings.reservedTiles);
        FloorplanEditor.instance.renderTiles();
    }

    useNitroEvent<RoomEngineEvent>(RoomEngineEvent.DISPOSED, event => setIsVisible(false));

    useMessageEvent<FloorHeightMapEvent>(FloorHeightMapEvent, event =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.tilemap = parser.model;
            newValue.wallHeight = (parser.wallHeight + 1);

            return newValue;
        });

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.wallHeight = (parser.wallHeight + 1);

            return newValue;
        });
    });

    useMessageEvent<RoomVisualizationSettingsEvent>(RoomVisualizationSettingsEvent, event =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.thicknessFloor = convertSettingToNumber(parser.thicknessFloor);
            newValue.thicknessWall = convertSettingToNumber(parser.thicknessWall);

            return newValue;
        });

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.thicknessFloor = convertSettingToNumber(parser.thicknessFloor);
            newValue.thicknessWall = convertSettingToNumber(parser.thicknessWall);

            return newValue;
        });
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'floor-editor/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <FloorplanEditorContextProvider value={ { originalFloorplanSettings: originalFloorplanSettings, setOriginalFloorplanSettings: setOriginalFloorplanSettings, visualizationSettings: visualizationSettings, setVisualizationSettings: setVisualizationSettings } }>
            { isVisible &&
                <NitroCardView uniqueKey="floorpan-editor" className="nitro-floorplan-editor no-resize" theme="primary">
                    <NitroCardHeaderView headerText={ LocalizeText('floor.plan.editor.title') } onCloseClick={ () => setIsVisible(false) } />
                    <Flex className='floorplan-background-color font-size-11' gap={ 4 }>
                        <Base className='icon icon-floorplan-subtitle'/>
                        <Text>{ LocalizeText('floor.plan.editor.subtitle') }</Text>
                    </Flex>
                    <NitroCardContentView overflow="hidden">
                        <FloorplanOptionsView />
                        <FloorplanCanvasView overflow="hidden" />
                        <Flex justifyContent="between">
                            <Button variant="thicker" onClick={ revertChanges }>{ LocalizeText('floor.plan.editor.reload') }</Button>
                            <Flex gap={ 1 }>
                                <Button variant="thicker" onClick={ event => setImportExportVisible(true) }>{ LocalizeText('floor.plan.editor.import.export') }</Button>
                                <Button variant="thicker" onClick={ saveFloorChanges }>{ LocalizeText('floor.plan.editor.save') }</Button>
                            </Flex>
                        </Flex>
                    </NitroCardContentView>
                </NitroCardView> }
            { importExportVisible &&
                <FloorplanImportExportView onCloseClick={ () => setImportExportVisible(false) } /> }
        </FloorplanEditorContextProvider>
    );
}
