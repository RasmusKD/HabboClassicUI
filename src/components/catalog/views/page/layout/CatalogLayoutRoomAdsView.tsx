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
    <div className="h-100">
        <Column overflow="hidden" className="text-black pets-padding">
            <Text bold>{ LocalizeText('roomad.catalog_text', [ 'duration' ], [ '120' ]) }</Text>
                <Column gap={ 2 }>
                    <select className={`form-select-pet ${isCategoryIdOpen ? 'mb-1 active' : 'mb-1'}`} value={ categoryId } onChange={ event => setCategoryId(parseInt(event.target.value)) } disabled={ extended } onClick={() => handleSelectToggle('categoryId')} onBlur={() => setIsCategoryIdOpen(false)}>
                        { categories && categories.map((cat, index) => <option key={ index } value={ cat.id }>{ LocalizeText(cat.name) }</option>) }
                    </select>
                </Column>
                <Column gap={ 1 }>
                    <Text className='font-size-profile'>{ LocalizeText('roomad.catalog_name') }</Text>
                    <input type="text" className="mb-1 form-control form-control3 form-control-sm" maxLength={ 64 } value={ eventName } onChange={ event => setEventName(event.target.value) } readOnly={ extended } />
                </Column>
                <Column className="h-itemgrid" gap={ 1 }>
                    <Text className='font-size-profile'>{ LocalizeText('roomad.catalog_description') }</Text>
                    <textarea className="flex-grow-1 form-control form-control3 w-100" maxLength={ 64 } value={ eventDesc } onChange={ event => setEventDesc(event.target.value) } readOnly={ extended } />
                </Column>
                <Column gap={ 1 }>
                    <Text className='font-size-profile'>{ LocalizeText('roomad.catalog_roomname') }</Text>
                    <select className={`form-select-pet ${isRoomIdOpen ? 'active mb-1' : 'mb-1'}`} value={ roomId } onChange={ event => setRoomId(parseInt(event.target.value)) } disabled={ extended } onClick={() => handleSelectToggle('roomId')} onBlur={() => setIsRoomIdOpen(false)}>
                        <option value={ -1 } disabled>{ LocalizeText('roomad.catalog_roomname') }</option>
                        { availableRooms && availableRooms.map((room, index) => <option key={ index } value={ room.roomId }>{ room.roomName }</option>) }
                    </select>
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
