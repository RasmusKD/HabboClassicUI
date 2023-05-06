import { ApproveNameMessageComposer, ApproveNameMessageEvent, ColorConverter, GetSellablePetPalettesComposer, PurchaseFromCatalogComposer, SellablePetPaletteData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { DispatchUiEvent, GetPetAvailableColors, GetPetIndexFromLocalization, LocalizeText, SendMessageComposer } from '../../../../../../api';
import { AutoGrid, Base, Button, Column, Flex, Grid, LayoutGridItem, LayoutPetImageView, HCColorGridItem, HC2ColorGridItem, Text } from '../../../../../../common';
import { CatalogPurchaseFailureEvent } from '../../../../../../events';
import { useCatalog, useMessageEvent } from '../../../../../../hooks';
import { CatalogPurchaseWidgetView } from '../../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutPetView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const [ petIndex, setPetIndex ] = useState(-1);
    const [ sellablePalettes, setSellablePalettes ] = useState<SellablePetPaletteData[]>([]);
    const [ selectedPaletteIndex, setSelectedPaletteIndex ] = useState(-1);
    const [ sellableColors, setSellableColors ] = useState<number[][]>([]);
    const [ selectedColorIndex, setSelectedColorIndex ] = useState(-1);
    const [ petName, setPetName ] = useState('');
    const [ approvalPending, setApprovalPending ] = useState(true);
    const [ approvalResult, setApprovalResult ] = useState(-1);
    const { currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null, catalogOptions = null, roomPreviewer = null } = useCatalog();
    const { petPalettes = null } = catalogOptions;
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedPaletteIndex(parseInt(event.target.value));
    }

    function handleSelectClick() {
      setIsOpen(!isOpen);
      updateDropdownPosition();
    }


    function handleSelectBlur() {
        setIsOpen(false);
    }

    const updateDropdownPosition = useCallback(() => {
      const selectElement = document.querySelector('.petcustomSelect');

      if (!selectElement) return;

      const rect = selectElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > windowHeight) {
        const diff = rect.bottom - windowHeight;
        setDropdownPosition({ top: -diff - 'x' }); // Replace 'x' with the desired offset
      } else {
        setDropdownPosition({ top: 0 });
      }
    }, []);

    const getColor = useMemo(() =>
    {
        if(!sellableColors.length || (selectedColorIndex === -1)) return 0xFFFFFF;

        return sellableColors[selectedColorIndex][0];
    }, [ sellableColors, selectedColorIndex ]);

    const petBreedName = useMemo(() =>
    {
        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return '';

        return LocalizeText(`pet.breed.${ petIndex }.${ sellablePalettes[selectedPaletteIndex].breedId }`);
    }, [ petIndex, sellablePalettes, selectedPaletteIndex ]);

    const petPurchaseString = useMemo(() =>
    {
        if(!sellablePalettes.length || (selectedPaletteIndex === -1)) return '';

        const paletteId = sellablePalettes[selectedPaletteIndex].paletteId;

        let color = 0xFFFFFF;

        if(petIndex <= 7)
        {
            if(selectedColorIndex === -1) return '';

            color = sellableColors[selectedColorIndex][0];
        }

        let colorString = color.toString(16).toUpperCase();

        while(colorString.length < 6) colorString = ('0' + colorString);

        return `${ paletteId }\n${ colorString }`;
    }, [ sellablePalettes, selectedPaletteIndex, petIndex, sellableColors, selectedColorIndex ]);

    const validationErrorMessage = useMemo(() =>
    {
        let key: string = '';

        switch(approvalResult)
        {
            case 1:
                key = 'catalog.alert.petname.long';
                break;
            case 2:
                key = 'catalog.alert.petname.short';
                break;
            case 3:
                key = 'catalog.alert.petname.chars';
                break;
            case 4:
                key = 'catalog.alert.petname.bobba';
                break;
        }

        if(!key || !key.length) return '';

        return LocalizeText(key);
    }, [ approvalResult ]);

    const purchasePet = useCallback(() =>
    {
        if(approvalResult === -1)
        {
            SendMessageComposer(new ApproveNameMessageComposer(petName, 1));

            return;
        }

        if(approvalResult === 0)
        {
            SendMessageComposer(new PurchaseFromCatalogComposer(page.pageId, currentOffer.offerId, `${ petName }\n${ petPurchaseString }`, 1));

            return;
        }
    }, [ page, currentOffer, petName, petPurchaseString, approvalResult ]);

    useMessageEvent<ApproveNameMessageEvent>(ApproveNameMessageEvent, event =>
    {
        const parser = event.getParser();

        setApprovalResult(parser.result);

        if(parser.result === 0) purchasePet();
        else DispatchUiEvent(new CatalogPurchaseFailureEvent(-1));
    });

    useEffect(() =>
    {
        if(!page || !page.offers.length) return;

        const offer = page.offers[0];

        setCurrentOffer(offer);
        setPetIndex(GetPetIndexFromLocalization(offer.localizationId));
    }, [ page, setCurrentOffer ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        const productData = currentOffer.product.productData;

        if(!productData) return;

        if(petPalettes)
        {
            for(const paletteData of petPalettes)
            {
                if(paletteData.breed !== productData.type) continue;

                const palettes: SellablePetPaletteData[] = [];

                for(const palette of paletteData.palettes)
                {
                    if(!palette.sellable) continue;

                    palettes.push(palette);
                }

                setSelectedPaletteIndex((palettes.length ? 0 : -1));
                setSellablePalettes(palettes);

                return;
            }
        }

        setSelectedPaletteIndex(-1);
        setSellablePalettes([]);

        SendMessageComposer(new GetSellablePetPalettesComposer(productData.type));
    }, [ currentOffer, petPalettes ]);

    useEffect(() =>
    {
        if(petIndex === -1) return;

        const colors = GetPetAvailableColors(petIndex, sellablePalettes);
        console.log(colors);

        setSelectedColorIndex((colors.length ? 0 : -1));
        setSellableColors(colors);
    }, [ petIndex, sellablePalettes ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        roomPreviewer.reset(false);

        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return;

        let petFigureString = `${ petIndex } ${ sellablePalettes[selectedPaletteIndex].paletteId }`;

        if(petIndex <= 7) petFigureString += ` ${ getColor.toString(16) }`;

        roomPreviewer.addPetIntoRoom(petFigureString);
    }, [ roomPreviewer, petIndex, sellablePalettes, selectedPaletteIndex, getColor ]);

    useEffect(() =>
    {
        setApprovalResult(-1);
    }, [ petName ]);

    if(!currentOffer) return null;

    return (
        <div className="h-default-colors-pet">
            <Column className="position-relative catalog-default-image" center={ !currentOffer } size={ 5 } gap={ 0 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogTotalPriceWidget className="credits-default-layout credits-bg bottom-1 end-1" justifyContent="end" alignItems="end" />
                        </Base>
                        <Text className='pet-textsize'>Vælg en farve:</Text>
                        </>}
                        </Column>
                        { ((petIndex > -1) && (petIndex <= 7)) &&
                        <Column className={`grid-bg ${petIndex === 2 ? 'h-itemgrid-pets' : 'h-itemgrid'}`} size={ 7 } overflow="hidden">
                            <AutoGrid className="colors-padding" gap={ 1 } columnCount={ 11 } columnMinWidth={ 25 } columnMinHeight={ 40 }>
                                { (sellableColors.length > 0) && sellableColors.map((colorSet, index) =>
                                <HCColorGridItem itemHighlight key={ index } itemActive={ (selectedColorIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } className="clear-bg" onClick={ event => setSelectedColorIndex(index) } />) }
                            </AutoGrid>
                        </Column>}
                        {[8, 10, 12, 14, 17, 18, 19, 20, 21, 22, 23, 25, 32, 36].includes(petIndex) &&
                        <Column className="grid-bg h-itemgrid-pets" size={ 7 } overflow="hidden">
                            <AutoGrid className="colors-padding" gap={ 1 } columnCount={ 11 } columnMinWidth={ 25 } columnMinHeight={ 40 }>
                                { (sellableColors.length > 0) && sellableColors.map((colorSet, index) =>
                                {
                                    return (
                                     <HCColorGridItem itemHighlight key={ index } itemActive={ (selectedPaletteIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } className="clear-bg" onClick={ event => setSelectedPaletteIndex(index) } />
                                     );
                                 }) }
                            </AutoGrid>
                        </Column>}
                        {[9, 11, 15, 24, 26, 27, 28, 29, 30, 31, 35].includes(petIndex) &&
                        <Column className="grid-bg h-itemgrid-pets" size={ 7 } overflow="hidden">
                            <AutoGrid className="colors-padding" gap={ 1 } columnCount={ 11 } columnMinWidth={ 25 } columnMinHeight={ 40 }>
                                { (sellableColors.length > 0) && sellableColors.map((colorSet, index) =>
                                {
                                    return (
                                     <HC2ColorGridItem itemHighlight key={ index } itemActive={ (selectedPaletteIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } itemColor2={ ColorConverter.int2rgb(colorSet[1]) }className="clear-bg" onClick={ event => setSelectedPaletteIndex(index) } />
                                     );
                                 }) }
                            </AutoGrid>
                        </Column>}
                        { (petIndex != 2) && (petIndex >= 0 && petIndex <= 7) &&
                        <Column className='petselect' gap={ 0 } >
                               <Text className='pet-textsize'>Vælg en race:</Text>
                              <div className={`petcustomSelect ${isOpen ? 'active' : ''}`} onClick={handleSelectClick} onBlur={handleSelectBlur} tabIndex={0}>
                                  <div className="selectButton">{sellablePalettes[selectedPaletteIndex] ? LocalizeText(`pet.breed.${petIndex}.${sellablePalettes[selectedPaletteIndex].paletteId}`) : ''}</div>
                                  <div className="options" style={{ top: dropdownPosition.top,}}>
                                      {sellablePalettes.length > 0 && sellablePalettes.map((palette, index) => (
                                           <div className={`option ${isOpen && selectedPaletteIndex === index ? 'selected' : ''}`} onMouseOver={ event => setSelectedPaletteIndex(index) } onClick={ event => setSelectedPaletteIndex(index) } key={index} value={index}>{LocalizeText(`pet.breed.${petIndex}.${palette.paletteId}`)} </div>
                                        ))}
                                  </div>
                              </div>
                        </Column>}
                        <Column grow gap={ 0 }>
                            <Column grow className={ (petIndex != 2) && (petIndex >= 0 && petIndex <= 7) ? 'petselectmargin' : '' } gap={ 0 }>
                                <Flex fullWidth justifyContent="between">
                                    <Base className='pet-textsize' dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } }/>
                                    { (approvalResult > 0) &&
                                    <Base style={{ color: 'red' }} className="pet-textsize">{ validationErrorMessage }</Base> }
                                </Flex>
                                <input spellCheck="false" type="text" maxLength={ 15 } className="form-control form-control-sm w-100" value={ petName } onChange={(event) => { const inputValue = event.target.value; const pattern = /^[a-zA-ZæøåÆØÅ0-9]*$/; if (pattern.test(inputValue)) { setPetName(inputValue.slice(0, 15)); }}}/>
                            </Column>
                            <Flex gap={ 2 } className="purchase-buttons align-items-end">
                                <CatalogPurchaseWidgetView purchaseCallback={ purchasePet } />
                            </Flex>
                        </Column>
        </div>
    );
}
