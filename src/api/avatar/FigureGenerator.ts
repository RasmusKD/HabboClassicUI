import { AvatarFigureContainer, IFigurePartSet, IPalette, IPartColor, SetType } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager } from '../nitro';
import { Randomizer } from '../utils';
import { FigureData } from './FigureData';

function getTotalColors(partSet: IFigurePartSet): number
{
    const parts = partSet.parts;

    let totalColors = 0;

    for(const part of parts) totalColors = Math.max(totalColors, part.colorLayerIndex);

    return totalColors;
}

function getRandomSetTypes(requiredSets: string[], options: string[]): string[]
{
    options = options.filter(option => (requiredSets.indexOf(option) === -1));

    return [ ...requiredSets, ...Randomizer.getRandomElements(options, (Randomizer.getRandomNumber(options.length) + 1)) ];
}

function getRandomPartSet(setType: SetType, gender: string, clubLevel: number = 0, figureSetIds: number[] = []): IFigurePartSet
{
    if(!setType) return null;

    const options = setType.partSets.getValues().filter(option =>
    {
        if(!option.isSelectable || ((option.gender !== 'U') && (option.gender !== gender)) || (option.clubLevel > clubLevel) || (option.isSellable && (figureSetIds.indexOf(option.id) === -1))) return null;

        return option;
    });

    if(!options || !options.length) return null;

    return Randomizer.getRandomElement(options);
}

function getRandomColors(palette: IPalette, partSet: IFigurePartSet, clubLevel: number = 0): IPartColor[]
{
    if(!palette) return [];

    const options = palette.colors.getValues().filter(option =>
    {
        if(!option.isSelectable || (option.clubLevel > clubLevel)) return null;

        return option;
    });

    if(!options || !options.length) return null;

    return Randomizer.getRandomElements(options, getTotalColors(partSet));
}

function getRandomOptionalSetTypes(options: string[], maxOptionalSets: number): string[] {
    const numOptionalSets = Math.floor(Math.random() * (maxOptionalSets + 1)); // Generate number between 0 and maxOptionalSets
    return Randomizer.getRandomElements(options, numOptionalSets);
}

// ...

export function generateRandomFigure(figureData: FigureData, gender: string, clubLevel: number = 0, figureSetIds: number[] = [], ignoredSets: string[] = []): string
{
    const structure = GetAvatarRenderManager().structure;
    const figureContainer = new AvatarFigureContainer('');

    // Include 'hair' and 'shirts' in the required sets based on gender
    let requiredSets = structure.getMandatorySetTypeIds(gender, clubLevel);

    if (gender === 'F' && !requiredSets.includes('hr')) {
        requiredSets = [ ...requiredSets, 'hr' ];
    }
    else if (gender === 'M') {
        if (Math.random() < 0.8 && !requiredSets.includes('hr')) { // 80% chance to include hair for males
            requiredSets = [ ...requiredSets, 'hr' ];
        }
        if (Math.random() < 0.8 && !requiredSets.includes('ch')) { // 80% chance to include shirts for males
            requiredSets = [ ...requiredSets, 'ch' ];
        }
    }

    if (Math.random() < 0.8 && !requiredSets.includes('sh')) { // 80% chance to include shoes for anyone
        requiredSets = [ ...requiredSets, 'sh' ];
    }
    // Specify the optional sets and limit the number that can be included
    const limitedOptionalSets = ['ha', 'he', 'er', 'ea', 'fa']; // replace these with actual identifiers
    const maxOptionalSets = 2; // maximum number of optional sets
    const selectedLimitedOptionalSets = getRandomOptionalSetTypes(limitedOptionalSets, maxOptionalSets);

    // Determine the other optional sets
        const otherOptionalSets = FigureData.SET_TYPES.filter(type => !requiredSets.includes(type) && !limitedOptionalSets.includes(type));
        const selectedOtherOptionalSets = otherOptionalSets.filter(type => Math.random() < 0.2);  // 20% chance to include each other optional set

        const chosenSetTypes = new Set([...requiredSets, ...selectedLimitedOptionalSets, ...selectedOtherOptionalSets]);

        for(const setType of ignoredSets)
        {
            const partSetId = figureData.getPartSetId(setType);
            const colors = figureData.getColorIds(setType);

            figureContainer.updatePart(setType, partSetId, colors);
        }

        for(const type of FigureData.SET_TYPES)
        {
            if (!chosenSetTypes.has(type)) continue;

            if(figureContainer.hasPartType(type)) continue;

            const setType = (structure.figureData.getSetType(type) as SetType);
            const selectedSet = getRandomPartSet(setType, gender, clubLevel, figureSetIds);

            if(!selectedSet) continue;

            let selectedColors: number[] = [];

            if(selectedSet.isColorable)
            {
                selectedColors = getRandomColors(structure.figureData.getPalette(setType.paletteID), selectedSet, clubLevel).map(color => color.id);
            }

            figureContainer.updatePart(setType.type, selectedSet.id, selectedColors);
        }

        return figureContainer.getFigureString();
    }