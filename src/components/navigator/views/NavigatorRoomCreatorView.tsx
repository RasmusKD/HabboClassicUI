/* eslint-disable no-template-curly-in-string */
import { CreateFlatMessageComposer, HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetClubMemberLevel, GetConfiguration, IRoomModel, LocalizeText, SendMessageComposer } from '../../../api';
import { useFilteredInput, AutoGrid, Base, Button, Column, Flex, Grid, LayoutCurrencyIcon, LayoutGridItem, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { RoomCreatorGridItem } from '../../../common/layout/RoomCreatorGridItem';
import { useNavigator } from '../../../hooks';

export const NavigatorRoomCreatorView: FC<{}> = props =>
{
    const [ maxVisitorsList, setMaxVisitorsList ] = useState<number[]>(null);
    const [ name, setName ] = useState<string>(null);
    const [ description, setDescription ] = useState<string>(null);
    const [ category, setCategory ] = useState<number>(null);
    const [ approvalResult, setApprovalResult ] = useState(-1);
    const [ visitorsCount, setVisitorsCount ] = useState<number>(null);
    const [ tradesSetting, setTradesSetting ] = useState<number>(0);
    const [ roomModels, setRoomModels ] = useState<IRoomModel[]>([]);
    const [ selectedModelName, setSelectedModelName ] = useState<string>('');
    const { categories = null } = useNavigator();
    const selectedCategoryName = categories.find(categoryItem => categoryItem.id === category)?.name || '';
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isVisitorsCountOpen, setIsVisitorsCountOpen] = useState(false);
    const [isTradesSettingOpen, setIsTradesSettingOpen] = useState(false);

    const handleNameInputChange = useFilteredInput(name, setName);
    const handleDescriptionInputChange = useFilteredInput(description, setDescription);

    const handleSelectToggle = (selectName: string) => {
        switch (selectName) {
            case 'category':
                setIsCategoryOpen(!isCategoryOpen);
                break;
            case 'visitorsCount':
                setIsVisitorsCountOpen(!isVisitorsCountOpen);
                break;
            case 'tradesSetting':
                setIsTradesSettingOpen(!isTradesSettingOpen);
                break;
            default:
                break;
        }
    };

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

    const getRoomModelImage = (name: string) => GetConfiguration<string>('images.url') + `/navigator/models/model_${ name }.png`;

    const selectModel = (model: IRoomModel, index: number) =>
    {
        if(!model || (model.clubLevel > GetClubMemberLevel())) return;

        setSelectedModelName(roomModels[index].name);
    };

    const createRoom = () => {
        setApprovalResult(0);
        if (!name || name.length < 3) {
            setApprovalResult(1);
            return;
        }
    SendMessageComposer(new CreateFlatMessageComposer(name, description, 'model_' + selectedModelName, Number(category), Number(visitorsCount), tradesSetting));
};

    useEffect(() =>
    {
        if(!maxVisitorsList)
        {
            const list = [];

            for(let i = 10; i <= 50; i = i + 5) list.push(i);


            setMaxVisitorsList(list);
            setVisitorsCount(25);
        }
    }, [ maxVisitorsList ]);

    useEffect(() =>
    {
        if(categories && categories.length) setCategory(categories[0].id);
    }, [ categories ]);

    useEffect(() =>
    {
        setApprovalResult(-1);
    }, [ name ]);

    useEffect(() =>
    {
        const models = GetConfiguration<IRoomModel[]>('navigator.room.models');

        if(models && models.length)
        {
            setRoomModels(models);
            setSelectedModelName(models[0].name);
        }
    }, []);

    return (
        <NitroCardView overflow="visible" className="nitro-room-creator no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.createroom.title') } onCloseClick={ event => CreateLinkEvent('navigator/close-creator') } />
            <NitroCardContentView>
                <Column overflow="hidden">
                    <Grid columnCount={ 13 } overflow="hidden" className="friendbars something3">
                        <Column size={ 6 } gap={ 1 } overflow="auto" className="px-2">
                            <Column gap={ 1 }>
                                <Flex fullWidth justifyContent="between">
                                    <Text gfbold>{ LocalizeText('navigator.createroom.roomnameinfo') }</Text>
                                </Flex>
                            { (approvalResult > 0) &&
                            <Base className='error-image'/>}
                                <textarea value={ name } spellCheck="false" type="text" className={`goldfish form-control form-control6-2 room-name ${approvalResult > 0 ? 'error-color' : ''}`} maxLength={ 60 } onChange={handleNameInputChange} placeholder={ LocalizeText('navigator.createroom.roomnameinfo') } />
                            </Column>
                            <Column grow gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.createroom.roomdescinfo') }</Text>
                                <textarea value={ description } spellCheck="false" type="text" className="goldfish flex-grow-1 form-control form-control6-2" maxLength={ 255 } onChange={handleDescriptionInputChange} placeholder={ LocalizeText('navigator.createroom.roomdescinfo') } />
                            </Column>
                            <Column className="test-height" gap={ 1 }>
                                    <Text gfbold>{ LocalizeText('navigator.category') }</Text>
                                    <div className={`creatorcustomSelect creator-placement1 ${isCategoryOpen ? 'active' : ''}`} onClick={() => handleSelectToggle('category')} onBlur={() => setIsCategoryOpen(false)} tabIndex={0}>
                                        <div className="selectButton">{ LocalizeText(selectedCategoryName) }</div>
                                        <div className="options">
                                            {categories && categories.length > 0 && categories.map(categoryItem => (
                                                <div
                                                    key={categoryItem.id}
                                                    value={categoryItem.id}
                                                    className={`option ${isCategoryOpen && categoryItem.id === category ? 'selected' : ''}`}
                                                    onClick={() => setCategory(categoryItem.id)}>
                                                    { LocalizeText(categoryItem.name) }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Column>
                            <Column className="test-height" gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.maxvisitors') }</Text>
                                <div className={`creatorcustomSelect creator-placement2 ${isVisitorsCountOpen ? 'active' : ''}`} onClick={() => handleSelectToggle('visitorsCount')} onBlur={() => setIsVisitorsCountOpen(false)} tabIndex={0}>
                                    <div className="selectButton">{visitorsCount}</div>
                                    <div className="options">
                                        {maxVisitorsList && maxVisitorsList.map(value => (
                                            <div
                                                key={value}
                                                value={value}
                                                className={`option ${isVisitorsCountOpen && value === visitorsCount ? 'selected' : ''}`}
                                                onClick={() => setVisitorsCount(value)}>
                                                {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Column>
                            <Column className="test-height" gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.tradesettings') }</Text>
                                <div className={`creatorcustomSelect creator-placement3 ${isTradesSettingOpen ? 'active' : ''}`} onClick={() => handleSelectToggle('tradesSetting')} onBlur={() => setIsTradesSettingOpen(false)} tabIndex={0}>
                                    <div className="selectButton">{LocalizeText(`navigator.roomsettings.trade_${tradesSetting === 0 ? 'not_allowed' : tradesSetting === 1 ? 'not_with_Controller' : 'allowed'}`)}</div>
                                    <div className="options">
                                        {[0, 1, 2].map(value => (
                                            <div
                                                key={value}
                                                value={value}
                                                className={`option ${isTradesSettingOpen && value === tradesSetting ? 'selected' : ''}`}
                                                onClick={() => setTradesSetting(value)}>
                                                {LocalizeText(`navigator.roomsettings.trade_${value === 0 ? 'not_allowed' : value === 1 ? 'not_with_Controller' : 'allowed'}`)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Column>
                            <Flex gap={ 2 }>
                                <Button fullWidth className="volter-bold-button" onClick={ createRoom }>{ LocalizeText('navigator.createroom.create') }</Button>
                                <Button fullWidth className="volter-button" onClick={ event => CreateLinkEvent('navigator/close-creator') } >{ LocalizeText('cancel') }</Button>
                            </Flex>
                        </Column>
                        <Column size={ 7 } gap={ 1 } overflow="auto">
                            <Column>
                                <Text gfbold>
                                    {LocalizeText('navigator.createroom.chooselayoutcaption')}
                                </Text>
                            </Column>
                            <Column overflow="auto">
                            <AutoGrid gap={ 1 } className="room-creator-grid" columnCount={ 2 } columnMinWidth={ 105 } columnMinHeight={ 50 }>
                                {
                                    roomModels.map((model, index )=>
                                    {
                                        return (<RoomCreatorGridItem fullHeight key={ model.name } onClick={ () => selectModel(model, index) } itemActive={ (selectedModelName === model.name) } overflow="unset" gap={ 0 } disabled={ (GetClubMemberLevel() < model.clubLevel) }>
                                            <Flex fullHeight center overflow="hidden">
                                                <img draggable="false" alt="" src={ getRoomModelImage(model.name) } />
                                            </Flex>
                                            <Flex position="absolute" className="bottom-1 start-1" gap={ 1 } style={{ backgroundColor: selectedModelName === model.name ? '#77888b' : '#cbcbcb' }}>
                                                <Base className={ `icon  ${selectedModelName === model.name ? 'icon-tile-selected' : 'icon-tile' }`}/>
                                                <Text>{ model.tileSize } { LocalizeText('navigator.createroom.tilesize') }</Text>
                                            </Flex>
                                            { !hcDisabled && model.clubLevel > HabboClubLevelEnum.NO_CLUB && <LayoutCurrencyIcon position="absolute" className="top-1 end-1" type="hc" /> }
                                            { selectedModelName && <i className="active-arrow"/> }
                                        </RoomCreatorGridItem>);
                                    })
                                }
                            </AutoGrid>
                            </Column>
                        </Column>
                    </Grid>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
