import { FC, useCallback } from 'react';
import { AvatarEditorColorPicker, CategoryData, IAvatarEditorCategoryModel } from '../../../../api';
import { HexColorPicker } from 'react-colorful';

export interface AvatarEditorPaletteSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    colorPicker: AvatarEditorColorPicker;
    colorPickerIndex: number;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props =>
{
    const { model = null, category = null, colorPicker = null, colorPickerIndex = 0 } = props;

    const selectColor = useCallback((hexColor: string) =>
    {

        model.selectColor(category.name, hexColor.substring(1), colorPickerIndex);

    }, [ model, category, colorPickerIndex ]);

    return (
        <div>
            <HexColorPicker color={ colorPicker ? `#${ colorPicker.partColor.rgb.toString(16) }` : '#000000' } onChange={ selectColor } />
            <div>{ `#${ colorPicker.partColor.rgb.toString(16) }` }</div>
        </div>
    );
}
