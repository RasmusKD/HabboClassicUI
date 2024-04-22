export interface IAvatarFigureContainer
{
    getPartTypeIds(): IterableIterator<string>;
    hasPartType(_arg_1: string): boolean;
    getPartSetId(_arg_1: string): number;
    getPartHexColors(_arg_1: string): string[];
    updatePart(setType: string, partSetId: number, hexColors: string[]): void;
    removePart(_arg_1: string): void;
    getFigureString(): string;
}
