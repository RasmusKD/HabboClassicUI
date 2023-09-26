import { GetRoomAdPurchaseInfoComposer, GetUserEventCatsMessageComposer, PurchaseRoomAdMessageComposer, RoomAdPurchaseInfoEvent, RoomEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutCurrencyIconBig, Text } from '../../../../../common';
import { useCatalog, useMessageEvent, useNavigator, useRoomPromote } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';

export const CatalogLayoutRoomAdsView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ eventName, setEventName ] = useState<string>('');
    const [ eventDesc, setEventDesc ] = useState<string>('');
    const [ roomId, setRoomId ] = useState<number>(-1);
    const [ availableRooms, setAvailableRooms ] = useState<RoomEntryData[]>([]);
    const [ extended, setExtended ] = useState<boolean>(false);
    const [ categoryId, setCategoryId ] = useState<number>(1);
    const { categories = null } = useNavigator();
    const { setIsVisible = null } = useCatalog();
    const { promoteInformation, isExtended, setIsExtended } = useRoomPromote();
    const [isCategoryIdOpen, setIsCategoryIdOpen] = useState(false);
    const [isRoomIdOpen, setIsRoomIdOpen] = useState(false);

    const handleSelectToggle = (selectName) => {
        switch (selectName) {
            case 'categoryId':
                setIsCategoryIdOpen(!isCategoryIdOpen);
                break;
            case 'roomId':
                setIsRoomIdOpen(!isRoomIdOpen);
                break;
            default:
                break;
        }
    };
    useEffect(() =>
    {
        if(isExtended)
        {
            setRoomId(promoteInformation.data.flatId);
            setEventName(promoteInformation.data.eventName);
            setEventDesc(promoteInformation.data.eventDescription);
            setCategoryId(promoteInformation.data.categoryId);
            setExtended(isExtended); // This is for sending to packet
            setIsExtended(false); // This is from hook useRoomPromotte
        }

    }, [ isExtended, eventName, eventDesc, categoryId ]);

    const resetData = () =>
    {
        setRoomId(-1);
        setEventName('');
        setEventDesc('');
        setCategoryId(1);
        setIsExtended(false);
        setIsVisible(false);
    }

    const purchaseAd = () =>
    {
        const pageId = page.pageId;
        const offerId = page.offers.length >= 1 ? page.offers[0].offerId : -1;
        const flatId = roomId;
        const name = eventName;
        const desc = eventDesc;
        const catId = categoryId;

        SendMessageComposer(new PurchaseRoomAdMessageComposer(pageId, offerId, flatId, name, extended, desc, catId));
        resetData();
    }

    useMessageEvent<RoomAdPurchaseInfoEvent>(RoomAdPurchaseInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setAvailableRooms(parser.rooms);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomAdPurchaseInfoComposer());
        // TODO: someone needs to fix this for morningstar
        SendMessageComposer(new GetUserEventCatsMessageComposer());
    }, []);

    return (<>
    <div className="h-100 friendbars something3">
        <Column overflow="hidden" className="text-black pets-padding">
            <Text bold>{ LocalizeText('roomad.catalog_text', [ 'duration' ], [ '120' ]) }</Text>
                <Column gap={ 2 }>
                    <div className={`customSelect ${isCategoryIdOpen ? 'mb-1 active' : 'mb-1'}`} onClick={() => { if (!extended) handleSelectToggle('categoryId'); }} onBlur={() => setIsCategoryIdOpen(false)} tabIndex={0}>
                        <div className="selectButton" style={{opacity: extended ? 0.5 : 1, pointerEvents: extended ? 'none' : 'auto'}}>{LocalizeText(`${categories.find(cat => cat.id === categoryId)?.name}`)}</div>
                        <div className="options">
                            {categories && categories.map((cat, index) => (
                                <div
                                    key={index}
                                    value={cat.id}
                                    className={`option ${isCategoryIdOpen && cat.id === categoryId ? 'selected' : ''}`}
                                    onClick={(event) => { event.stopPropagation(); if (!extended) { setCategoryId(cat.id); setIsCategoryIdOpen(false); }}}>
                                    {LocalizeText(cat.name)}
                                </div>
                            ))}
                        </div>
                    </div>
                </Column>
                <Column gap={ 1 }>
                    <Text className='font-size-11'>{ LocalizeText('roomad.catalog_name') }</Text>
                    <input spellCheck="false" type="text" className="mb-1 form-control form-control3 form-control-sm" maxLength={ 64 } value={ eventName } onChange={ event => setEventName(event.target.value) } readOnly={ extended } />
                </Column>
                <Column className="h-itemgrid" gap={ 1 }>
                    <Text className='font-size-11'>{ LocalizeText('roomad.catalog_description') }</Text>
                    <textarea spellCheck="false" className="flex-grow-1 form-control form-control3 w-100" maxLength={ 64 } value={ eventDesc } onChange={ event => setEventDesc(event.target.value) } readOnly={ extended } />
                </Column>
                <Column gap={ 1 } className=' select-div-height mb-2'>
                    <Text className='font-size-11'>{ LocalizeText('roomad.catalog_roomname') }</Text>
                    <div className={`adscustomSelect ${isRoomIdOpen ? 'active mb-1' : 'mb-1'}`} onClick={() => { if (!extended) handleSelectToggle('roomId'); }} onBlur={() => setIsRoomIdOpen(false)} tabIndex={0}>
                        <div className="selectButton" style={{opacity: extended ? 0.5 : 1, pointerEvents: extended ? 'none' : 'auto'}}>{ roomId >= 0 ? availableRooms.find(room => room.roomId === roomId)?.roomName : LocalizeText('roomad.catalog_roomname') }</div>
                        <div className="options">
                            { availableRooms && availableRooms.map((room, index) =>
                                <div
                                    key={ index }
                                    value={ room.roomId }
                                    className={`option ${isRoomIdOpen && room.roomId === roomId ? 'selected' : ''}`}
                                    onClick={(event) => { event.stopPropagation(); if (!extended) { setRoomId(room.roomId); setIsRoomIdOpen(false); }}}>
                                    { room.roomName }
                                </div>)
                            }
                        </div>
                    </div>
                </Column>
                <Column gap={ 2 }>
                    <Flex alignItems="center" alignSelf="center" gap={ 1 }>
                        <Text bold>1</Text>
                        <LayoutCurrencyIconBig type={ -1 } />
                    </Flex>
                    <Button variant={ (!eventName || !eventDesc || roomId === -1) ? 'danger' : 'success' } onClick={ purchaseAd } disabled={ (!eventName || !eventDesc || roomId === -1) }>{ extended ? LocalizeText('roomad.extend.event') : LocalizeText('buy') }</Button>
                </Column>
            </Column>
        </div>
    </>
    );
}

interface INavigatorCategory {
    id: number;
    name: string;
    visible: boolean;
}
