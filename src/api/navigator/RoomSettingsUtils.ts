const BuildMaxVisitorsList = () =>
{
    const list: number[] = [];

    for(let i = 10; i <= 50; i = i + 5) list.push(i);

    return list;
}

export const GetMaxVisitorsList = BuildMaxVisitorsList();
