import { SellablePetPaletteData } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../nitro';
import { ICatalogNode } from './ICatalogNode';

export const GetPixelEffectIcon = (id: number) =>
{
    return '';
}

export const GetSubscriptionProductIcon = (id: number) =>
{
    return '';
}

export const GetOfferNodes = (offerNodes: Map<number, ICatalogNode[]>, offerId: number) =>
{
    const nodes = offerNodes.get(offerId);
    const allowedNodes: ICatalogNode[] = [];

    if(nodes && nodes.length)
    {
        for(const node of nodes)
        {
            if(!node.isVisible) continue;

            allowedNodes.push(node);
        }
    }

    return allowedNodes;
}

export const FilterCatalogNode = (search: string, furniLines: string[], node: ICatalogNode, nodes: ICatalogNode[]) =>
{
    if(node.isVisible && (node.pageId > 0))
    {
        let nodeAdded = false;

        const hayStack = [ node.pageName, node.localization ].join(' ').toLowerCase().replace(/ /gi, '');

        if(hayStack.indexOf(search) > -1)
        {
            nodes.push(node);

            nodeAdded = true;
        }

        if(!nodeAdded)
        {
            for(const furniLine of furniLines)
            {
                if(hayStack.indexOf(furniLine) >= 0)
                {
                    nodes.push(node);

                    break;
                }
            }
        }
    }

    for(const child of node.children) FilterCatalogNode(search, furniLines, child, nodes);
}

export function GetPetIndexFromLocalization(localization: string)
{
    if(!localization.length) return 0;

    let index = (localization.length - 1);

    while(index >= 0)
    {
        if(isNaN(parseInt(localization.charAt(index)))) break;

        index--;
    }

    if(index > 0) return parseInt(localization.substring(index + 1));

    return -1;
}

export function GetPetAvailableColors(petIndex: number, palettes: SellablePetPaletteData[]): number[][]
{
    switch(petIndex)
    {
        case 0: //Dog
            return [ [ 16743226 ], [ 16750435 ], [ 16764339 ], [ 0xF59500 ], [ 16498012 ], [ 16704690 ], [ 0xEDD400 ], [ 16115545 ], [ 16513201 ], [ 8694111 ], [ 11585939 ], [ 14413767 ], [ 6664599 ], [ 9553845 ], [ 12971486 ], [ 8358322 ], [ 10002885 ], [ 13292268 ], [ 10780600 ], [ 12623573 ], [ 14403561 ], [ 12418717 ], [ 14327229 ], [ 15517403 ], [ 14515069 ], [ 15764368 ], [ 16366271 ], [ 0xABABAB ], [ 0xD4D4D4 ], [ 0xFFFFFF ], [ 14256481 ], [ 14656129 ], [ 15848130 ], [ 14005087 ], [ 14337152 ], [ 15918540 ], [ 15118118 ], [ 15531929 ], [ 9764857 ], [ 11258085 ] ];
        case 1: //Cat
            return [ [ 16743226 ], [ 16750435 ], [ 16764339 ], [ 0xF59500 ], [ 16498012 ], [ 16704690 ], [ 0xEDD400 ], [ 16115545 ], [ 16513201 ], [ 8694111 ], [ 11585939 ], [ 14413767 ], [ 6664599 ], [ 9553845 ], [ 12971486 ], [ 8358322 ], [ 10002885 ], [ 13292268 ], [ 10780600 ], [ 12623573 ], [ 14403561 ], [ 12418717 ], [ 14327229 ], [ 15517403 ], [ 14515069 ], [ 15764368 ], [ 16366271 ], [ 0xABABAB ], [ 0xD4D4D4 ], [ 0xFFFFFF ], [ 14256481 ], [ 14656129 ], [ 15848130 ], [ 14005087 ], [ 14337152 ], [ 15918540 ], [ 15118118 ], [ 15531929 ], [ 9764857 ], [ 11258085 ] ];
        case 2: //Crocodile
            return [ [ 16579283 ], [ 15378351 ], [ 8830016 ], [ 15257125 ], [ 9340985 ], [ 8949607 ], [ 6198292 ], [ 8703620 ], [ 9889626 ], [ 8972045 ], [ 12161285 ], [ 13162269 ], [ 8620113 ], [ 12616503 ], [ 8628101 ], [ 0xD2FF00 ], [ 9764857 ] ];
        case 3: //Terrier
            return [ [ 0xFFFFFF ], [ 0xEEEEEE ], [ 0xDDDDDD ] ];
        case 4: //Bear
            return [ [ 0xFFFFFF ], [ 16053490 ], [ 15464440 ], [ 16248792 ], [ 15396319 ], [ 15007487 ] ];
        case 5: //Pig
            return [ [ 0xFFFFFF ], [ 0xEEEEEE ], [ 0xDDDDDD ] ];
        case 6: //Lion
            return [ [ 0xFFFFFF ], [ 0xEEEEEE ], [ 0xDDDDDD ], [ 16767177 ], [ 16770205 ], [ 16751331 ] ];
        case 7: //Rhino
            return [ [ 0xCCCCCC ], [ 0xAEAEAE ], [ 16751331 ], [ 10149119 ], [ 16763290 ], [ 16743786 ] ];
        case 8: //Spider
            return [ [ 9789479 ], [ 5820109 ], [ 12700257 ], [ 13797481 ], [ 11156071 ], [ 5879499 ], [ 12636266 ], [ 11825353 ], [ 5879499 ], [ 3238332 ], [ 7246565 ], [ 3980185 ], [ 10710868 ] ];
         case 9: //Turtle
             return [ [ 13864265, 5733943 ], [ 5397830, 5733943 ], [ 11157026, 5733943 ], [ 15251252, 5733943 ], [ 9335124, 5733943 ], [ 5875775, 11298593 ], [ 11157026, 5875775 ], [ 3124257, 2710364 ], [ 13195439, 5875775 ] ];
          case 10: //Chicken
              return [ [ 16175427 ], [ 16728484 ], [ 4313087 ], [ 6017309 ], [ 7357993 ] ];
          case 11: //Frog
              return [ [ 16769644, 8691459 ], [ 16370243, 7102024 ], [ 14732096, 9345808 ], [ 15264751, 11649230 ], [ 11709032, 8217395 ], [ 15886403, 7698648 ], [ 12188152, 4703442 ], [ 15572760, 11560462 ], [ 15395044, 12696495 ], [ 11522361, 8822798 ], [ 15384503, 13327439 ], [ 13020989, 16698954 ] ];
          case 12: //Dragon
              return [ [ 12651532, 16777215 ], [ 7440188, 16777215 ], [ 7292474, 16777215 ], [ 8536467, 16777215 ], [ 4079430, 16777215 ], [ 12036770, 16777215 ] ];
//          case 13: //N/A
//              return [ ];
          case 14: //Monkey
              return [ [ 9724763, 16777215 ], [ 7293508, 16777215 ], [ 12620425, 16777215 ], [ 12011831, 16777215 ], [ 8221553, 16777215 ], [ 15705088, 16777215 ], [ 12935873, 16777215 ], [ 5019299, 16777215 ], [ 9717926, 16777215 ], [ 10124907, 16777215 ], [ 5985135, 16777215 ], [ 16286831, 16777215 ], [ 12238273, 16777215 ], [ 5529681, 16777215 ] ];
          case 15: //Horse
              return [ [ 14268293, 15194817 ], [ 14268293, 13019259 ], [ 14268293, 12228712 ], [ 14268293, 11764304 ], [ 11960384, 13150332 ], [ 11960384, 9591342 ], [ 11960384, 9591342 ], [ 11960384, 9591342 ], [ 8608310, 11771006 ], [ 8608310, 7030307 ], [ 8608310, 7030307 ], [ 8608310, 7030307 ], [ 12498339, 14342100 ], [ 12498339, 11182997 ], [ 12498339, 11182997 ], [ 12498339, 11182997 ], [ 12407374, 14246505 ], [ 12407374, 14713501 ], [ 12407374, 14713501 ], [ 12407374, 12871308 ] ];
//          case 16: //Monsterplant
//              return [ ];
          case 17: //Rabbit
              return [ [ 16777215 ], [ 7895160 ], [ 16049664 ], [ 3850276 ], [ 8056823 ] ];
//          case 18: //Evil Bunny
//              return [ ];
//          case 19: //Bored Bunny
//              return [ ];
//          case 20: //Love Bunny
//              return [ ];
//          case 21: //Wise Pidgeon
//              return [ ];
//          case 22: //Cunning Pidgeon
//              return [ ];
//          case 23: //Evil Monkey
//              return [ ];
          case 24: //Baby Bear
              return [ [ 14738658, 10922407 ], [ 16777215, 13817299 ], [ 11711154, 7829367 ], [ 5987163, 3947580 ], [ 14411242, 9547454 ], [ 14869218, 8092539 ], [ 8421504, 10922407 ], [ 9724709, 6830080 ], [ 9398334, 12951889 ], [ 14252840, 9457945 ] ];
          case 25: //Baby Terrier
              return [ [ 14079702 ], [ 7763574 ], [ 16185078 ], [ 16099812 ], [ 13005637 ], [ 14723715 ], [ 15651774 ], [ 14733187 ], [ 16245941 ], [ 14278787 ] ];
//          case 26: //Gnome
//              return [ ];
//          case 27: //Leprechaun
//              return [ ];
         case 28: //Baby Cat
             return [ [ 12108487, 9217711 ], [ 15644802, 14128736 ], [ 14935011, 14128736 ], [ 9344673, 9344673 ], [ 13224393, 7567486 ], [ 12757124, 9599320 ], [ 13617339, 8089438 ], [ 8870192, 8870192 ], [ 16777215, 16777215 ], [ 13421772, 7171437 ] ];
         case 29: //Baby Dog
             return [ [ 15658734, 14590312 ], [ 9920059, 15852236 ], [ 11692854, 15117170 ], [ 3420464, 10786452 ], [ 15326155, 16315371 ], [ 6051151, 13931360 ], [ 14079455, 8156793 ], [ 16446958, 13469765 ], [ 14727824, 7888473 ], [ 16448250, 6381921 ] ];
         case 30: //Baby Pig
             return [ [ 16047830, 15638917 ], [ 16117478, 13282710 ], [ 4735281, 7432020 ], [ 10449733, 8409123 ], [ 14336692, 8678228 ], [ 14462846, 5785915 ], [ 12433589, 14539481 ], [ 13221303, 8946557 ], [ 14326098, 15918021 ], [ 6181176, 14009520 ] ];
         case 31: //Haloompa
             return [ ];
//         case 32: //Fools
//             return [ ];
//         case 33: //Pterodactyl
//             return [ ];
//         case 34: //Velociraptor
//             return [ ];
//         case 35: //Cow
//             return [ ];


        default: {
            const colors: number[][] = [];

            for(const palette of palettes)
            {
                const petColorResult = GetRoomEngine().getPetColorResult(petIndex, palette.paletteId);

                if(!petColorResult) continue;

                if(petColorResult.primaryColor === petColorResult.secondaryColor)
                {
                    colors.push([ petColorResult.primaryColor ]);
                }
                else
                {
                    colors.push([ petColorResult.primaryColor, petColorResult.secondaryColor ]);
                }
            }

            return colors;
        }
    }
}
