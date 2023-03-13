/* eslint-disable no-template-curly-in-string */
import { CreateFlatMessageComposer, HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { CreateLinkEvent, GetClubMemberLevel, GetConfiguration, IRoomModel, LocalizeText, SendMessageComposer } from '../../../api';
import { AutoGrid, Base, Button, Column, Flex, Grid, LayoutCurrencyIcon, LayoutGridItem, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
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

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isVisitorsCountOpen, setIsVisitorsCountOpen] = useState(false);
    const [isTradesSettingOpen, setIsTradesSettingOpen] = useState(false);

    const handleSelectToggle = (selectName) => {
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
        <NitroCardView className="nitro-room-creator no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.createroom.title') } onCloseClick={ event => CreateLinkEvent('navigator/close-creator') } />
            <NitroCardContentView>
                <Column overflow="hidden">
                    <Grid overflow="hidden">
                        <Column size={ 5 } gap={ 1 } overflow="auto" className="px-2 py-1">
                            <Column gap={ 1 }>
                                <Flex fullWidth justifyContent="between">
                                    <Text gfbold>{ LocalizeText('navigator.createroom.roomnameinfo') }</Text>
                                </Flex>
                            { (approvalResult > 0) &&
                            <Base className='error-image'/>}
                                <input value={ name } spellCheck="false" type="text" className={`room-creator-form ${approvalResult > 0 ? 'error-color' : ''}`} maxLength={ 60 } onChange={ event => setName(event.target.value) } placeholder={ LocalizeText('navigator.createroom.roomnameinfo') } />
                            </Column>
                            <Column grow gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.createroom.roomdescinfo') }</Text>
                                <textarea spellCheck="false" className="flex-grow-1 room-creator-form" maxLength={ 255 } onChange={ event => setDescription(event.target.value) } placeholder={ LocalizeText('navigator.createroom.roomdescinfo') } />
                            </Column>
                            <Column gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.category') }</Text>
                                <select className={`form-select form-select-sm ${isCategoryOpen ? 'active' : ''}`} onChange={ event => setCategory(Number(event.target.value)) } onClick={() => handleSelectToggle('category')} onBlur={() => setIsCategoryOpen(false)}>
                                    { categories && (categories.length > 0) && categories.map(category =>
                                    {
                                        return <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>
                                    }) }
                                </select>
                            </Column>
                            <Column gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.maxvisitors') }</Text>
                                <select value={ visitorsCount } className={`form-select form-select-sm ${isVisitorsCountOpen ? 'active' : ''}`} onChange={ event => setVisitorsCount(Number(event.target.value)) } onClick={() => handleSelectToggle('visitorsCount')} onBlur={() => setIsVisitorsCountOpen(false)}>
                                    { maxVisitorsList && maxVisitorsList.map(value =>
                                    {
                                        return <option key={ value } value={ value }>{ value }</option>
                                    }) }
                                </select>
                            </Column>
                            <Column gap={ 1 }>
                                <Text gfbold>{ LocalizeText('navigator.tradesettings') }</Text>
                                <select className={`form-select form-select-sm ${isTradesSettingOpen ? 'active' : ''}`} onChange={ event => setTradesSetting(Number(event.target.value)) } onClick={() => handleSelectToggle('tradesSetting')} onBlur={() => setIsTradesSettingOpen(false)}>
                                    <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                                    <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                                    <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                                </select>
                            </Column>
                            <Flex gap={ 2 }>
                                <Button fullWidth className="volter-bold-button" onClick={ createRoom }>{ LocalizeText('navigator.createroom.create') }</Button>
                                <Button fullWidth className="volter-button" onClick={ event => CreateLinkEvent('navigator/close-creator') } >{ LocalizeText('cancel') }</Button>
                            </Flex>
                        </Column>
                        <Column size={ 7 } gap={ 1 } overflow="auto">
                            <AutoGrid className="room-creator-grid" columnCount={ 2 } columnMinWidth={ 100 } columnMinHeight={ 50 } overflow="unset">
                                {
                                    roomModels.map((model, index )=>
                                    {
                                        return (<RoomCreatorGridItem fullHeight key={ model.name } onClick={ () => selectModel(model, index) } itemActive={ (selectedModelName === model.name) } overflow="unset" gap={ 0 } className="py-3" disabled={ (GetClubMemberLevel() < model.clubLevel) }>
                                            <Flex fullHeight center overflow="hidden">
                                                <img alt="" src={ getRoomModelImage(model.name) } />
                                            </Flex>
                                            <Text position="absolute" className="bottom-1 start-1">{ model.tileSize } { LocalizeText('navigator.createroom.tilesize') }</Text>
                                            { !hcDisabled && model.clubLevel > HabboClubLevelEnum.NO_CLUB && <LayoutCurrencyIcon position="absolute" className="top-1 end-1" type="hc" /> }
                                            { selectedModelName && <i className="active-arrow"/> }
                                        </RoomCreatorGridItem>);
                                    })
                                }
                            </AutoGrid>
                        </Column>
                    </Grid>
                </Column>

            </NitroCardContentView>
        </NitroCardView>
    );
}
