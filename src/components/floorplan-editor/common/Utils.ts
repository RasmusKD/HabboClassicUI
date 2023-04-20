export const convertNumbersForSaving = (value: number): number =>
{
    value = parseInt(value.toString());
    switch(value)
    {
        case 0:
            return -2;
        case 1:
            return -1;
        case 3:
            return 1;
        default:
            return 0;

    }
}

export const convertSettingToNumber = (value: number): number =>
{
    switch(value)
    {
        case 0.25:
            return 0;
        case 0.5:
            return 1;
        case 2:
            return 3;
        default:
            return 2;
    }
}
