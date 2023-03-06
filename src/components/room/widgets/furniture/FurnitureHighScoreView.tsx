import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useFurnitureHighScoreWidget } from '../../../../hooks';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { ContextMenuListView } from '../context-menu/ContextMenuListView';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const { stuffDatas = null, getScoreType = null, getClearType = null } = useFurnitureHighScoreWidget();

    if(!stuffDatas || !stuffDatas.size) return null;

     return (
            <>
                { Array.from(stuffDatas.entries()).map(([ objectId, stuffData ], index) =>
                {
                    return (
                        <ObjectLocationView key={ index } objectId={ objectId } category={ RoomObjectCategory.FLOOR }>
                            <Column className="nitro-widget-high-score" gap={ 0 }>
                                <Flex center className="nitro-widget-high-score-header">
                                    <Text small bold>{ LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [ LocalizeText(`high.score.display.scoretype.${ getScoreType(stuffData.scoreType) }`), LocalizeText(`high.score.display.cleartype.${ getClearType(stuffData.clearType) }`) ]) }</Text>
                                </Flex>
                                <Column overflow="hidden" gap={ 1 } className="h-100">
                                    <Column gap={ 1 }>
                                        <Flex alignItems="center" className="score-board-header mt-1 p-1">
                                            <Text small variant="black" className="col-8">
                                                { LocalizeText('high.score.display.users.header') }
                                            </Text>
                                            <Text small variant="black" className="col-4">
                                                { LocalizeText('high.score.display.score.header') }
                                            </Text>
                                        </Flex>
                                        <hr className="m-0" />
                                    </Column>
                                    <Column overflow="auto" gap={ 1 } className="overflow-y-auto high-score-results p-2">
                                        { stuffData.entries.map((entry, index) =>
                                        {
                                            return (
                                                <Flex key={ index } alignItems="center">
                                                    <Text small variant="white" className="col-8">
                                                        { entry.users.join(', ') }
                                                    </Text>
                                                    <Text small center variant="white" className="col-4">
                                                        { entry.score }
                                                    </Text>
                                                </Flex>
                                            );
                                        }) }
                                    </Column>
                                    <i className="trophy position-absolute"/>
                                    <Flex center className="bottom-text">
                                        <Text small center>{LocalizeText('high.score.display.congratulations.footer')}</Text>
                                    </Flex>
                                </Column>
                            </Column>
                        </ObjectLocationView>
                    );
                }) }
            </>
        );
    }
