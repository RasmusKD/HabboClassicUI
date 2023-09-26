import { FC, useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../api';
import { Button, Column, Flex, Text } from '../../../common';
import { COLORMAP, FloorAction } from '../common/Constants';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../FloorplanEditorContext';

const MIN_WALL_HEIGHT: number = 0;
const MAX_WALL_HEIGHT: number = 16;

const MIN_FLOOR_HEIGHT: number = 0;
const MAX_FLOOR_HEIGHT: number = 26;
const thicknessMapping = { 0: 'thinnest', 1: 'thin', 2: 'normal', 3: 'thick', };

export const FloorplanOptionsView: FC<{}> = props =>
{
    const { visualizationSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext();
    const [ floorAction, setFloorAction ] = useState(FloorAction.SET);
    const [ floorHeight, setFloorHeight ] = useState(0);
    const thicknessOptions = [0, 1, 2, 3];
    const [wallThicknessIsOpen, setWallThicknessIsOpen] = useState(false);
    const [floorThicknessIsOpen, setFloorThicknessIsOpen] = useState(false);

    function handleWallThicknessSelectClick() {
        setWallThicknessIsOpen(!wallThicknessIsOpen);
    }

    function handleWallThicknessSelectBlur() {
        setWallThicknessIsOpen(false);
    }

    function handleFloorThicknessSelectClick() {
        setFloorThicknessIsOpen(!floorThicknessIsOpen);
    }

    function handleFloorThicknessSelectBlur() {
        setFloorThicknessIsOpen(false);
    }

    const ColorSegments = ({ min, max, colormap }) => {
      const segments = [];
      const totalSteps = 27;

      for (let i = 0; i <= totalSteps; i++) {
        const percentStart = (i / totalSteps) * 100;
        const percentEnd = (i === totalSteps) ? 100 : ((i + 1) / totalSteps) * 100;

        segments.push(
          <div key={i} style={{ backgroundColor: `#${colormap[(min + i).toString(33)]}`, left: `${percentStart}%`, width: `${percentEnd - percentStart}%`,position: "absolute", height: "100%", }} />
        );
      }

      return <div style={{ position: "absolute", width: "100%", height: "100%" }}>{segments}</div>;
    };

    const selectAction = (action: number) =>
    {
        setFloorAction(action);

        FloorplanEditor.instance.actionSettings.currentAction = action;
    }

    const changeDoorDirection = () =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            if(newValue.entryPointDir < 7)
            {
                ++newValue.entryPointDir;
            }
            else
            {
                newValue.entryPointDir = 0;
            }

            return newValue;
        });
    }

    const onFloorHeightChange = (value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = 0;

        if(value > 26) value = 26;

        setFloorHeight(value);

        FloorplanEditor.instance.actionSettings.currentHeight = value.toString(36);
    }

    const onFloorThicknessChange = (value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.thicknessFloor = value;

            return newValue;
        });
    }

    const onWallThicknessChange = (value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.thicknessWall = value;

            return newValue;
        });
    }

    const onWallHeightChange = (value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = MIN_WALL_HEIGHT;

        if(value > MAX_WALL_HEIGHT) value = MAX_WALL_HEIGHT;

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.wallHeight = value;

            return newValue;
        });
    }

    const increaseWallHeight = () =>
    {
        let height = (visualizationSettings.wallHeight + 1);

        if(height > MAX_WALL_HEIGHT) height = MAX_WALL_HEIGHT;

        onWallHeightChange(height);
    }

    const decreaseWallHeight = () =>
    {
        let height = (visualizationSettings.wallHeight - 1);

        if(height <= 0) height = MIN_WALL_HEIGHT;

        onWallHeightChange(height);
    }

    return (
        <Column>
            <Flex gap={ 1 }>
                <Column size={ 5 } gap={ 1 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.draw.mode') }</Text>
                    <Flex gap={ 3 }>
                        <Flex gap={ 1 }>
                            <Button variant="thicker" className={`floorplan-button-padding ${floorAction === FloorAction.SET ? 'active' : ''}`} itemActive={ (floorAction === FloorAction.SET) } onClick={ event => selectAction(FloorAction.SET) }>
                                <i className="icon icon-set-tile" />
                            </Button>
                            <Button variant="thicker" className={`floorplan-button-padding ${floorAction === FloorAction.UNSET ? 'active' : ''}`} itemActive={ (floorAction === FloorAction.UNSET) } onClick={ event => selectAction(FloorAction.UNSET) }>
                                <i className="icon icon-unset-tile" />
                            </Button>
                        </Flex>
                        <Flex gap={ 1 }>
                            <Button variant="thicker" className={`floorplan-button-padding ${floorAction === FloorAction.UP ? 'active' : ''}`} itemActive={ (floorAction === FloorAction.UP) } onClick={ event => selectAction(FloorAction.UP) }>
                                <i className="icon icon-increase-height" />
                            </Button>
                            <Button variant="thicker" className={`floorplan-button-padding ${floorAction === FloorAction.DOWN ? 'active' : ''}`} itemActive={ (floorAction === FloorAction.DOWN) } onClick={ event => selectAction(FloorAction.DOWN) }>
                                <i className="icon icon-decrease-height" />
                            </Button>
                        </Flex>
                        <Button variant="thicker" className={`floorplan-button-padding ${floorAction === FloorAction.DOOR ? 'active' : ''}`} itemActive={ (floorAction === FloorAction.DOOR) } onClick={ event => selectAction(FloorAction.DOOR) }>
                            <i className="icon icon-set-door" />
                        </Button>
                    </Flex>
                </Column>
                <Column alignItems="center" size={ 4 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.enter.direction') }</Text>
                    <i className={ `icon icon-door-direction-${ visualizationSettings.entryPointDir } cursor-pointer` } onClick={ changeDoorDirection } />
                </Column>
                <Column size={ 3 }>
                    <Text bold>{ LocalizeText('floor.editor.wall.height') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <FaCaretLeft className="cursor-pointer fa-icon" onClick={ decreaseWallHeight } />
                        <input type="number" className="form-control form-control-sm quantity-input" value={ visualizationSettings.wallHeight } onChange={ event => onWallHeightChange(event.target.valueAsNumber) } />
                        <FaCaretRight className="cursor-pointer fa-icon" onClick={ increaseWallHeight } />
                    </Flex>
                </Column>
            </Flex>
            <Flex gap={ 1 }>
                <Column size={ 6 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.tile.height') }: { floorHeight }</Text>
                       <div style={{ position: "relative", width: "100%", height: 25 }}>
                         <ColorSegments min={MIN_FLOOR_HEIGHT} max={MAX_FLOOR_HEIGHT} colormap={COLORMAP} />
                         <ReactSlider
                           className="floor-slider"
                           min={MIN_FLOOR_HEIGHT}
                           max={MAX_FLOOR_HEIGHT}
                           step={1}
                           value={floorHeight}
                           onChange={(event) => onFloorHeightChange(event)}
                           renderThumb={({ style, ...rest }, state) => (
                             <div
                               style={{ ...style }}
                               {...rest}
                             >
                             </div>
                           )}
                         />
                       </div>
                </Column>
                <Column size={ 6 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.room.options') }</Text>
                    <Flex className="align-items-center">
                        <div className={`customSelect ${wallThicknessIsOpen ? 'active' : ''}`} onClick={handleWallThicknessSelectClick} onBlur={handleWallThicknessSelectBlur} tabIndex={0}>
                            <div className="selectButton">{LocalizeText(`navigator.roomsettings.wall_thickness.${thicknessMapping[visualizationSettings.thicknessWall]}`)}</div>
                            <div className="options">
                                {thicknessOptions.map(value => (
                                    <div
                                        key={value}
                                        value={value}
                                        className={`option ${wallThicknessIsOpen && value === visualizationSettings.thicknessWall ? 'selected' : ''}`}
                                        onClick={() => onWallThicknessChange(value)}>
                                        {LocalizeText(`navigator.roomsettings.wall_thickness.${thicknessMapping[value]}`)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`customSelect ${floorThicknessIsOpen ? 'active' : ''}`} onClick={handleFloorThicknessSelectClick} onBlur={handleFloorThicknessSelectBlur} tabIndex={0}>
                            <div className="selectButton">{LocalizeText(`navigator.roomsettings.floor_thickness.${thicknessMapping[visualizationSettings.thicknessFloor]}`)}</div>
                            <div className="options">
                                {thicknessOptions.map(value => (
                                    <div
                                        key={value}
                                        value={value}
                                        className={`option ${floorThicknessIsOpen && value === visualizationSettings.thicknessFloor ? 'selected' : ''}`}
                                        onClick={() => onFloorThicknessChange(value)}>
                                        {LocalizeText(`navigator.roomsettings.floor_thickness.${thicknessMapping[value]}`)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Flex>
                </Column>
            </Flex>
        </Column>
    );
}