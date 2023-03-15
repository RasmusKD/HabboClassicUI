import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

const teamIds1: number[] = [1, 3];
const teamIds2: number[] = [2, 4];

export const WiredConditionActorIsTeamMemberView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ selectedTeam ]);

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>{ LocalizeText('wiredfurni.params.team') }</Text>
                <Flex className='wired-align wired-help-bottom wired-team-width'>
                <Column fullWidth gap={ 2 }>
                { teamIds1.map(value =>
                {
                    return (
                        <Flex key={ value } gap={ 1 } alignItems="center">
                            <input className="flash-wired-form-check-radio-input" type="radio" name="selectedTeam" id={ `selectedTeam${ value }` } checked={ (selectedTeam === value) } onChange={ event => setSelectedTeam(value) } />
                            <Text>{ LocalizeText(`wiredfurni.params.team.${ value }`) }</Text>
                        </Flex>
                    )
                }) }
            </Column>
            <Column fullWidth gap={ 2 }>
                { teamIds2.map(value =>
                {
                    return (
                        <Flex key={ value } gap={ 1 } alignItems="center">
                            <input className="flash-wired-form-check-radio-input" type="radio" name="selectedTeam" id={ `selectedTeam${ value }` } checked={ (selectedTeam === value) } onChange={ event => setSelectedTeam(value) } />
                            <Text>{ LocalizeText(`wiredfurni.params.team.${ value }`) }</Text>
                        </Flex>
                    )
                }) }
            </Column>
            </Flex>
        </WiredConditionBaseView>
    );
}
