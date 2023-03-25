import { GiftReceiverNotFoundEvent, PurchaseFromCatalogAsGiftComposer } from '@nitrots/nitro-renderer';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ColorUtils, GetSessionDataManager, LocalizeText, MessengerFriend, ProductTypeEnum, SendMessageComposer } from '../../../../api';
import { Base, Button, ButtonGroup, classNames, Column, Flex, FormGroup, LayoutCurrencyIcon, LayoutFurniImageView, LayoutGiftTagView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { GiftColorButton } from '../../../../common/GiftColorButton';
import { CatalogEvent, CatalogInitGiftEvent, CatalogPurchasedEvent } from '../../../../events';
import { useCatalog, useFriends, useMessageEvent, useUiEvent } from '../../../../hooks';

export const CatalogGiftView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ pageId, setPageId ] = useState<number>(0);
    const [ offerId, setOfferId ] = useState<number>(0);
    const [ extraData, setExtraData ] = useState<string>('');
    const [ receiverName, setReceiverName ] = useState<string>('');
    const [ showMyFace, setShowMyFace ] = useState<boolean>(true);
    const [ message, setMessage ] = useState<string>('');
    const [ colors, setColors ] = useState<{ id: number, color: string }[]>([]);
    const [ selectedBoxIndex, setSelectedBoxIndex ] = useState<number>(0);
    const [ selectedRibbonIndex, setSelectedRibbonIndex ] = useState<number>(0);
    const [ selectedColorId, setSelectedColorId ] = useState<number>(0);
    const [ maxBoxIndex, setMaxBoxIndex ] = useState<number>(0);
    const [ maxRibbonIndex, setMaxRibbonIndex ] = useState<number>(0);
    const [ receiverNotFound, setReceiverNotFound ] = useState<boolean>(false);
    const { catalogOptions = null } = useCatalog();
    const { friends } = useFriends();
    const { giftConfiguration = null } = catalogOptions;
    const [ boxTypes, setBoxTypes ] = useState<number[]>([]);
    const [ suggestions, setSuggestions ] = useState([]);
    const [ isAutocompleteVisible, setIsAutocompleteVisible ] = useState(true);

    const onClose = useCallback(() =>
    {
        setIsVisible(false);
        setPageId(0);
        setOfferId(0);
        setExtraData('');
        setReceiverName('');
        setShowMyFace(true);
        setMessage('');
        setSelectedBoxIndex(0);
        setSelectedRibbonIndex(0);
        setIsAutocompleteVisible(false);
        setSuggestions([]);

        if(colors.length) setSelectedColorId(colors[0].id);
    }, [ colors ]);

    const isBoxDefault = useMemo(() =>
    {
        return giftConfiguration ? (giftConfiguration.defaultStuffTypes.findIndex(s => (s === boxTypes[selectedBoxIndex])) > -1) : false;
    }, [ boxTypes, giftConfiguration, selectedBoxIndex ]);

    const boxExtraData = useMemo(() =>
    {
        if(!giftConfiguration) return '';

        return ((boxTypes[selectedBoxIndex] * 1000) + giftConfiguration.ribbonTypes[selectedRibbonIndex]).toString();
    }, [ giftConfiguration, selectedBoxIndex, selectedRibbonIndex, boxTypes ]);

    const isColorable = useMemo(() =>
    {
        if (!giftConfiguration) return false;

        if (isBoxDefault) return false;

        const boxType = boxTypes[selectedBoxIndex];

        return (boxType === 8 || (boxType >= 3 && boxType <= 6)) ? false : true;
    }, [ giftConfiguration, selectedBoxIndex, isBoxDefault, boxTypes ]);

    const colourId = useMemo(() =>
    {
        return isBoxDefault ? boxTypes[selectedBoxIndex] : selectedColorId;
    },[ isBoxDefault, boxTypes, selectedBoxIndex, selectedColorId ])

    const allFriends = friends.filter( (friend: MessengerFriend) => friend.id !== -1 );

    const onTextChanged = (e: ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;

        let suggestions = [];

        if (value.length > 0)
        {
            suggestions = allFriends.sort().filter((friend: MessengerFriend) => friend.name.includes(value));
        }

        setReceiverName(value);
        setIsAutocompleteVisible(true);
        setSuggestions(suggestions);
    };

    const selectedReceiverName = (friendName: string) =>
    {
        setReceiverName(friendName);
        setIsAutocompleteVisible(false);
    }

const handleAction = useCallback((action: string) =>
{
    switch(action)
    {
        case 'prev_box':
            setSelectedBoxIndex(prevValue => {
                const newValue = (prevValue === 0 ? maxBoxIndex : prevValue - 1);
                if (boxTypes[newValue] === 8) {
                    setSelectedRibbonIndex(10);
                }
                return newValue;
            });
            return;
        case 'next_box':
            setSelectedBoxIndex(prevValue => {
                const newValue = (prevValue === maxBoxIndex ? 0 : prevValue + 1);
                if (boxTypes[newValue] === 8) {
                    setSelectedRibbonIndex(10);
                }
                return newValue;
            });
            return;
        case 'prev_ribbon':
            setSelectedRibbonIndex(value => (value === 0 ? maxRibbonIndex : value - 1));
            return;
        case 'next_ribbon':
            setSelectedRibbonIndex(value => (value === maxRibbonIndex ? 0 : value + 1));
            return;
        case 'buy':
            if(!receiverName || (receiverName.length === 0))
            {
                setReceiverNotFound(true);
                return;
            }

            SendMessageComposer(new PurchaseFromCatalogAsGiftComposer(pageId, offerId, extraData, receiverName, message, colourId, selectedBoxIndex, selectedRibbonIndex, showMyFace));
            return;
    }
}, [ colourId, extraData, maxBoxIndex, maxRibbonIndex, message, offerId, pageId, receiverName, selectedBoxIndex, selectedRibbonIndex, showMyFace, boxTypes ]);

    useMessageEvent<GiftReceiverNotFoundEvent>(GiftReceiverNotFoundEvent, event => setReceiverNotFound(true));

    useUiEvent([
        CatalogPurchasedEvent.PURCHASE_SUCCESS,
        CatalogEvent.INIT_GIFT ], event =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                onClose();
                return;
            case CatalogEvent.INIT_GIFT:
                const castedEvent = (event as CatalogInitGiftEvent);

                onClose();

                setPageId(castedEvent.pageId);
                setOfferId(castedEvent.offerId);
                setExtraData(castedEvent.extraData);
                setIsVisible(true);
                return;
        }
    });

    useEffect(() =>
    {
        setReceiverNotFound(false);
    }, [ receiverName ]);

    const createBoxTypes = useCallback(() =>
    {
        if (!giftConfiguration) return;

        setBoxTypes(prev =>
        {
            let newPrev = giftConfiguration.boxTypes.filter(boxType => boxType !== 7);

            newPrev.push(giftConfiguration.defaultStuffTypes[ Math.floor((Math.random() * (giftConfiguration.defaultStuffTypes.length - 1))) ]);

            setMaxBoxIndex(newPrev.length - 1);
            setMaxRibbonIndex(newPrev.length + 1);

            return newPrev;
        })
    },[ giftConfiguration ])

    useEffect(() =>
    {
        if(!giftConfiguration) return;

        const newColors: { id: number, color: string }[] = [];

        for(const colorId of giftConfiguration.stuffTypes)
        {
            const giftData = GetSessionDataManager().getFloorItemData(colorId);

            if(!giftData) continue;

            if(giftData.colors && giftData.colors.length > 0) newColors.push({ id: colorId, color: ColorUtils.makeColorNumberHex(giftData.colors[0]) });
        }

        createBoxTypes();

        if(newColors.length)
        {
            setSelectedColorId(newColors[0].id);
            setColors(newColors);
        }
    }, [ giftConfiguration, createBoxTypes ]);

    useEffect(() =>
    {
        if (!isVisible) return;

        createBoxTypes();
    },[ createBoxTypes, isVisible ])

    if(!giftConfiguration || !giftConfiguration.isEnabled || !isVisible) return null;

    const boxName = 'catalog.gift_wrapping_new.box.' + (isBoxDefault ? 'default' : boxTypes[selectedBoxIndex]);
    const ribbonName = `catalog.gift_wrapping_new.ribbon.${ selectedRibbonIndex }`;
    const priceText = 'catalog.gift_wrapping_new.' + (isBoxDefault ? 'freeprice' : 'price');;

    return (
        <NitroCardView uniqueKey="catalog-gift" className="nitro-catalog-gift no-resize" theme="primary2">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.gift_wrapping.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="text-black">
                <FormGroup className="mb-1 gift-name-padding" column>
                    <input  spellCheck="false" type="text" className={ classNames('form-control form-control2 form-control-sm', receiverNotFound && 'is-invalid') } value={ receiverName } onChange={ (e) => onTextChanged(e) } />
                                                                                                                                                    { (suggestions.length > 0 && isAutocompleteVisible) &&
                                                                                                                                                        <Column className="autocomplete-gift-container">
                                                                                                                                                            { suggestions.map((friend: MessengerFriend) => (
                                                                                                                                                                <Base key={ friend.id } className="autocomplete-gift-item" onClick={ (e) => selectedReceiverName(friend.name) }>{ friend.name }</Base>
                                                                                                                                                            )) }
                                                                                                                                                        </Column>
                                                                                                                                                    }
                    <i className="icon icon-pen position-absolute pen-position"/>
                    { receiverNotFound &&
                        <Base className="gift-error">{ LocalizeText('catalog.gift_wrapping.receiver_not_found.title') }</Base> }
                </FormGroup>
                <LayoutGiftTagView figure={ GetSessionDataManager().figure } userName={ GetSessionDataManager().userName } message={ message } editable={ true } onChange={ (value) => setMessage(value) } />
                <Flex alignItems="center">
                    <input className="flash-form-check-input checkbox-margin" type="checkbox" name="showMyFace" checked={ showMyFace } onChange={ (e) => setShowMyFace(value => !value) } />
                    <label className="form-check-label">{ LocalizeText('catalog.gift_wrapping.show_face.title') }</label>
                </Flex>
                <Flex alignItems="center" gap={ 2 }>
                    { selectedColorId &&
                        <Base className="gift-preview gift-bg">
                            <LayoutFurniImageView className={`gift-bg-margin${boxTypes[selectedBoxIndex] === 8 ? ' gift-bg-margin2' : ''}`} productType={ ProductTypeEnum.FLOOR } productClassId={ colourId } extraData={ boxExtraData } />
                        </Base> }
                    <Column gap={ 1 }>
                        <Flex gap={ 2 }>
                            <ButtonGroup>
                                <Button className="volter-button gift-btn-margin gift-btn-params" onClick={ () => handleAction('prev_box') }>
                                    <i className="gift-arrow-left"/>
                                </Button>
                                <Button className="volter-button gift-btn-params" onClick={ () => handleAction('next_box') }>
                                    <i className="gift-arrow-right"/>
                                </Button>
                            </ButtonGroup>
                            <Column gap={ 0 }>
                                <Text className="gift-text-size font-bold">{ LocalizeText(boxName) }</Text>
                                <Flex alignItems="center" className="gift-text-size" gap={ 1 }>
                                    { LocalizeText(priceText, [ 'price' ], [ giftConfiguration.price.toString() ]) }
                                    { !isBoxDefault &&
                                    <Base className="gift-coin"/>}
                                </Flex>
                            </Column>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <ButtonGroup>
                                <Button className="volter-button gift-btn-margin gift-btn-params" disabled={ isBoxDefault || boxTypes[selectedBoxIndex] === 8 } onClick={ () => handleAction('prev_ribbon') }>
                                    <i className="gift-arrow-left"/>
                                </Button>
                                <Button className="volter-button gift-btn-params" disabled={ isBoxDefault || boxTypes[selectedBoxIndex] === 8 } onClick={ () => handleAction('next_ribbon') }>
                                    <i className="gift-arrow-right"/>
                                </Button>
                            </ButtonGroup>
                            <Text className="gift-text-size font-bold">{ LocalizeText(ribbonName) }</Text>
                        </Flex>
                    </Column>
                </Flex>
                <Column gap={ 1 } className={ isColorable ? '' : 'opacity-50 pointer-events-none' }>
                    <Text className="gift-text-size font-bold">
                        { LocalizeText('catalog.gift_wrapping.pick_color') }
                    </Text>
                    <ButtonGroup fullWidth className="gift-color-center gap-1">
                        { colors.map(color => <GiftColorButton key={ color.id } variant="dark" active={ (color.id === selectedColorId) } disabled={ !isColorable } style={ { backgroundColor: color.color } } onClick={ () => setSelectedColorId(color.id) } />) }
                    </ButtonGroup>
                </Column>
                <Flex justifyContent="between" alignItems="center" className="gift-buy-btn-margin">
                <Text underline pointer className="d-flex gap-1" onClick={ onClose }>
                    { LocalizeText('cancel') }
                </Text>
                    <Button variant="thicker" className="gift-button" onClick={ () => handleAction('buy') }>
                        { LocalizeText('catalog.gift_wrapping.give_gift') }
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
