import { FC, useCallback, useState, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { AvatarEditorColorPicker, CategoryData, IAvatarEditorCategoryModel } from '../../../../api';
import { FaPen, FaTimes } from 'react-icons/fa';

export interface AvatarEditorPaletteSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    colorPicker: AvatarEditorColorPicker;
    colorPickerIndex: number;
}
export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props =>
{
    const [ down, setDown ] = useState(false);
    const [ moving, setMoving ] = useState(false);
    const [ lastColor, setLastColor ] = useState('#ffffff');
    const [ isInputVisible, setInputVisible ] = useState(false);
    const { model = null, category = null, colorPicker = null, colorPickerIndex = 0 } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const handleMouseDown = () =>
    {
        setDown(true);
    }

    const handleMouseMove = () =>
    {
        if (down)
        {
            setMoving(true);
        }
    }

    const handleMouseUp = () =>
    {
        if (moving)
        {
            model.selectColor(category.name, lastColor.substring(1), colorPickerIndex);
        }
        setMoving(false);
        setDown(false);
    }

    const selectColor = useCallback((hexColor: string) =>
    {
        setLastColor(hexColor);
        if (!moving)
        {
            model.selectColor(category.name, hexColor.substring(1), colorPickerIndex);
        }
    }, [ model, category, colorPickerIndex, moving ]);

    useEffect(() =>
    {
        if(!colorPicker) return;

        colorPicker.notify = () => setUpdateId(prevValue => (prevValue + 1));

        return () =>
        {
            colorPicker.notify = null;
        }
    }, [ colorPicker ] );

    const color = colorPicker ? `#${ colorPicker.partColor.rgb.toString(16).padStart(6, '0') }` : '#ffffff';

    return (
        <section className="responsive">
            <HexColorPicker color={ color } onChange={ selectColor } onMouseDown={ handleMouseDown } onMouseUp={ handleMouseUp } onMouseMove={ handleMouseMove } />
            { isInputVisible && (
                <div className="color-input-container">
                    <HexColorInput color={ color } onChange={ selectColor } className="color-input" />
                    <button onClick={ () => setInputVisible(false) } className="close-button">
                        <FaTimes />
                    </button>
                </div>
            ) }
            <div className="color-picker-icon" onClick={ () => setInputVisible(!isInputVisible) }>
                <FaPen />
            </div>
        </section>
    );
}
