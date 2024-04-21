import { IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer, RemoveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import { FigureData, GetAvatarRenderManager, GetClubMemberLevel, GetConfiguration, LocalizeText, SendMessageComposer } from '../../../api';
import { AutoGrid, Base, Button, Column, Flex, LayoutAvatarImageView, LayoutCurrencyIcon, LayoutGridBlank } from '../../../common';

export interface AvatarEditorWardrobeViewProps
{
    figureData: FigureData;
    savedFigures: [ IAvatarFigureContainer, string ][];
    setSavedFigures: Dispatch<SetStateAction<[ IAvatarFigureContainer, string][]>>;
    loadAvatarInEditor: (figure: string, gender: string, reset?: boolean) => void;
    resetCategories: () => void;
}

export const AvatarEditorWardrobeView: FC<AvatarEditorWardrobeViewProps> = props =>
{
    const { figureData = null, savedFigures = [], setSavedFigures = null, loadAvatarInEditor = null, resetCategories = null } = props;

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

    const wearFigureAtIndex = useCallback((index: number) =>
    {
        if((index >= savedFigures.length) || (index < 0)) return;

        const [ figure, gender ] = savedFigures[index];

        loadAvatarInEditor(figure.getFigureString(), gender);
        resetCategories();
    }, [ savedFigures, loadAvatarInEditor ]);

    const saveFigureAtWardrobeIndex = useCallback((index: number) =>
    {
        if(!figureData || (index >= savedFigures.length) || (index < 0)) return;

        const newFigures = [ ...savedFigures ];

        const figure = figureData.getFigureString();
        const gender = figureData.gender;

        newFigures[index] = [ GetAvatarRenderManager().createFigureContainer(figure), gender ];

        setSavedFigures(newFigures);
        SendMessageComposer(new SaveWardrobeOutfitMessageComposer((index + 1), figure, gender));
    }, [ figureData, savedFigures, setSavedFigures ]);

    const removeFigureAtWardrobeIndex = useCallback((index: number) => 
    {
        if(index >= savedFigures.length || index < 0) return;

        const newFigures = [ ...savedFigures ];
        newFigures[index] = [ null, newFigures[index][1] ];

        setSavedFigures(newFigures);
        SendMessageComposer(new RemoveWardrobeOutfitMessageComposer(index + 1));
    }, [ savedFigures, setSavedFigures ]);

    const figures = useMemo(() =>
    {
        if(!savedFigures || !savedFigures.length) return [];

        const items: JSX.Element[] = [];

        savedFigures.forEach(([ figureContainer, gender ], index) =>
        {
            let clubLevel = 0;

            if(figureContainer) clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender);

            items.push(
                <LayoutGridBlank key={ index } position="relative" overflow="hidden" className="nitro-avatar-editor-wardrobe-figure-preview">
                    <Column gap={ 1 } className="button-container">
                        { figureContainer &&
                        <Base className="button-padding-wardrobe wardrobe-remove-button" onClick={ event => removeFigureAtWardrobeIndex(index) }></Base> }
                        <Base className="button-padding-wardrobe wardrobe-save-button" onClick={ event => saveFigureAtWardrobeIndex(index) }></Base>
                        { (figureContainer && clubLevel <= GetClubMemberLevel()) &&
                        <Base className="button-padding-wardrobe wardrobe-wear-button" fullWidth onClick={ event => wearFigureAtIndex(index) }></Base> }
                    </Column>
                    { figureContainer &&
                    <LayoutAvatarImageView className="testrendering" figure={ figureContainer.getFigureString() } gender={ gender } direction={ 4 } scale={ 0.5 } /> }
                    { !hcDisabled && (clubLevel > 0) && <LayoutCurrencyIcon className="position-absolute hc-icon-position" type="hc" /> }
                </LayoutGridBlank>
            );
        });

        return items;
    }, [ savedFigures, hcDisabled, saveFigureAtWardrobeIndex, wearFigureAtIndex ]);

    return (
        <AutoGrid className="wardrobefigurepadding" columnCount={ 5 } columnMinWidth={ 13 } columnMinHeight={ 50 }>
            { figures }
        </AutoGrid>
    );
}
