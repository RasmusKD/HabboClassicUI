import { IFigurePartSet } from './IFigurePartSet';
import { ISetType } from './ISetType';

export interface IStructureData
{
    parse(data: any): boolean;
    appendJSON(k: any): boolean;
    getSetType(_arg_1: string): ISetType;
    getFigurePartSet(_arg_1: number): IFigurePartSet;
}
