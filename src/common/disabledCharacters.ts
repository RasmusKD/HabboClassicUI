const generateCodePointRange = (startCode: number, endCode: number): number[] => {
  const range: number[] = [];

  for (let code = startCode; code <= endCode; code++) {
    range.push(code);
  }

  return range;
};

const range1 = generateCodePointRange(0x12400, 0x1247F);
const range2 = generateCodePointRange(0xFB50, 0xFDFF);
const range3 = generateCodePointRange(0xA980, 0xA9DF);
const range4 = generateCodePointRange(0x1B00, 0x1B7F);
const range5 = generateCodePointRange(0x0B00, 0x0B7F);
const range6 = generateCodePointRange(0x1950, 0x197F);
const range7 = generateCodePointRange(0x1000, 0x109F);
const range8 = generateCodePointRange(0x12000, 0x123FF);
const range9 = generateCodePointRange(0x2E00, 0x2E7F);

export const disabledCodePoints = [
     0x534D,
  ...range1,
  ...range2,
  ...range3,
  ...range4,
  ...range5,
  ...range6,
  ...range7,
  ...range8,
  ...range9,
];
