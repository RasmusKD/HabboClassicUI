import { FC, useCallback, useEffect, useRef, useState} from 'react';
import { AvatarEditorColorPicker, CategoryData, IAvatarEditorCategoryModel } from '../../../../api';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { FaPen, FaTimes } from 'react-icons/fa'; // <-- Add FaTimes import here

export interface AvatarEditorPaletteSetViewProps {
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    colorPicker: AvatarEditorColorPicker;
    colorPickerIndex: number;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props => {
    const { model = null, category = null, colorPicker = null, colorPickerIndex = 0 } = props;

    const defaultColor = colorPicker ? `#${colorPicker.partColor.rgb.toString(16)}` : '#ffffff';
    const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
    const [displayedColor, setDisplayedColor] = useState<string>(defaultColor);
    const [isInputVisible, setInputVisible] = useState(false);
    const isDraggingRef = useRef<boolean>(false); // ref to track dragging state

    useEffect(() => {
        setDisplayedColor(defaultColor);
        setSelectedColor(defaultColor);
    }, [defaultColor]);

    const handleInputChange = useCallback((hexColor: string) => {
        setDisplayedColor(hexColor);
        setSelectedColor(hexColor);
        model.selectColor(category.name, hexColor.substring(1), colorPickerIndex);
    }, [model, category, colorPickerIndex]);

    const handleColorChange = useCallback((hexColor: string) => {
        setDisplayedColor(hexColor);
        isDraggingRef.current = true; // mark as dragging
    }, []);

    const handleMouseUp = useCallback(() => {
        if (isDraggingRef.current) {
            setSelectedColor(displayedColor);
            model.selectColor(category.name, displayedColor.substring(1), colorPickerIndex);
            isDraggingRef.current = false; // reset dragging state
        }
    }, [displayedColor, model, category, colorPickerIndex]);

    useEffect(() => {
        // Listen to global mouse up event
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    return (
        <section className="responsive">
            <HexColorPicker color={displayedColor} onChange={handleColorChange} />
            {isInputVisible && (
                <div className="color-input-container">
                    <HexColorInput color={selectedColor} onChange={handleInputChange} className="color-input" />
                    <button onClick={() => setInputVisible(false)} className="close-button">
                        <FaTimes />
                    </button>
                </div>
            )}
            <div className="color-picker-icon" onClick={() => setInputVisible(!isInputVisible)}>
                <FaPen />
            </div>
        </section>
    );
}
