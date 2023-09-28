import { IPartColor, PartColor } from '@nitrots/nitro-renderer';

export class Randomizer
{
    public static getRandomNumber(count: number): number
    {
        return Math.floor(Math.random() * count);
    }

    public static getRandomElement<T>(elements: T[]): T
    {
        return elements[this.getRandomNumber(elements.length)];
    }

    public static getRandomElements<T>(elements: T[], count: number): T[]
    {
        const result: T[] = new Array(count);
        let len = elements.length;
        const taken = new Array(len);

        while(count--)
        {
            var x = this.getRandomNumber(len);
            result[count] = elements[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }

        return result;
    }

    public static getRandomColors(count: number): IPartColor[]
    {

        return Randomizer.getRandomHexColors(count).map(hexColor => new PartColor(hexColor));
    }

    public static getRandomHexColors(count: number): string[]
    {
        // +1 to include 0xffffff
        const hexColorsCount = parseInt('0xffffff') + 1;
        const result: string[] = [];
        
        while(count--)
        {
            const hexColor = this.getRandomNumber(hexColorsCount);
            result.push(hexColor.toString(16));
        }

        return result;
    }
}
