const AMOUNT_TYPES = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100 ];

const AMOUNT_TYPE_SERIE = [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 9, 9, 9, 9, 9, 10, 11, 11, 11, 11, 12, 13, 14, 14, 14, 14, 14, 15, 16, 16, 16, 16, 16, 17, 18, 18, 18, 18, 18, 19, 20, 20, 20, 20, 20, 21, 22, 22, 22, 22, 22, 23, 24, 24, 24, 24, 24, 25, 26, 26, 26, 26, 26, 27, 28, 28, 28, 28, 28, 29, 30, 30, 30, 30, 30, 31, 32, 32, 32, 33, 33 ];

export const CalculateDiscount = (amount: number, price: number, points: number) =>
{
    const amountType = getAmountTypeName(amount);

    const data = { 'total_price_discount': (amount * price) - (price * amountType), 'total_points_discount': points == 0 ? 0 : (amount * points) - (points * amountType), 'total_amount_free_serie': amountType, 'isDiscounting': amountType == 0 ? false : true }

    return data;
}

const getAmountTypeName = (amount: number) =>
{
    let index = AMOUNT_TYPES.indexOf(amount);

    if(index === -1) index = 0;

    return AMOUNT_TYPE_SERIE[index];
}
