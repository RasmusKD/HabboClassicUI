import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveRewardView: FC<{}> = props =>
{
    const [ limitEnabled, setLimitEnabled ] = useState(false);
    const [ rewardTime, setRewardTime ] = useState(1);
    const [ uniqueRewards, setUniqueRewards ] = useState(false);
    const [ rewardsLimit, setRewardsLimit ] = useState(1);
    const [ limitationInterval, setLimitationInterval ] = useState(1);
    const [ rewards, setRewards ] = useState<{ isBadge: boolean, itemCode: string, probability: number }[]>([]);
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    const addReward = () => setRewards(rewards => [ ...rewards, { isBadge: false, itemCode: '', probability: null } ]);

    const removeReward = (index: number) =>
    {
        setRewards(prevValue =>
        {
            const newValues = Array.from(prevValue);

            newValues.splice(index, 1);

            return newValues;
        });
    }

    const updateReward = (index: number, isBadge: boolean, itemCode: string, probability: number) =>
    {
        const rewardsClone = Array.from(rewards);
        const reward = rewardsClone[index];

        if(!reward) return;

        reward.isBadge = isBadge;
        reward.itemCode = itemCode;
        reward.probability = probability;

        setRewards(rewardsClone);
    }

    const save = () =>
    {
        let stringRewards = [];

        for(const reward of rewards)
        {
            if(!reward.itemCode) continue;

            const rewardsString = [ reward.isBadge ? '0' : '1', reward.itemCode, reward.probability.toString() ];
            stringRewards.push(rewardsString.join(','));
        }

        if(stringRewards.length > 0)
        {
            setStringParam(stringRewards.join(';'));
            setIntParams([ rewardTime, uniqueRewards ? 1 : 0, rewardsLimit, limitationInterval ]);
        }
    }

    useEffect(() =>
    {
        const readRewards: { isBadge: boolean, itemCode: string, probability: number }[] = [];

        if(trigger.stringData.length > 0 && trigger.stringData.includes(';'))
        {
            const splittedRewards = trigger.stringData.split(';');

            for(const rawReward of splittedRewards)
            {
                const reward = rawReward.split(',');

                if(reward.length !== 3) continue;

                readRewards.push({ isBadge: reward[0] === '0', itemCode: reward[1], probability: Number(reward[2]) });
            }
        }

        if(readRewards.length === 0) readRewards.push({ isBadge: false, itemCode: '', probability: null });

        setRewardTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setUniqueRewards((trigger.intData.length > 1) ? (trigger.intData[1] === 1) : false);
        setRewardsLimit((trigger.intData.length > 2) ? trigger.intData[2] : 0);
        setLimitationInterval((trigger.intData.length > 3) ? trigger.intData[3] : 0);
        setLimitEnabled((trigger.intData.length > 3) ? trigger.intData[3] > 0 : false);
        setRewards(readRewards);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Flex alignItems="center" gap={ 1 }>
                <input className="flash-wired-form-check-input" type="checkbox" id="limitEnabled" onChange={ event => setLimitEnabled(event.target.checked) } />
                <Text>{ LocalizeText('wiredfurni.params.prizelimit', [ 'amount' ], [ limitEnabled ? rewardsLimit.toString() : '' ]) }</Text>
            </Flex>
            { !limitEnabled &&
                <Text center  className="bg-muted rounded p-1">
                    Præmie-grænse ikke fastsat.
                </Text> }
            { limitEnabled &&
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 1000 }
                    value={ rewardsLimit }
                    onChange={ event => setRewardsLimit(event) } /> }
            <hr className="m-0 bg-dark" />
            <Column gap={ 1 }>
                <Text gfbold>Hvor ofte kan en bruger blive belønnet?</Text>
                <Flex gap={ 1 }>
                    <select className="form-select form-select-sm w-100" value={ rewardTime } onChange={ (e) => setRewardTime(Number(e.target.value)) }>
                        <option value="0">Èn gang</option>
                        <option value="3">Èn gang hver { limitationInterval } minutter</option>
                        <option value="2">Èn gang hver { limitationInterval } timer</option>
                        <option value="1">Èn gang hver { limitationInterval } dage</option>
                    </select>
                    { (rewardTime > 0) && <input type="number" className="form-control form-control-sm" value={ limitationInterval } onChange={ event => setLimitationInterval(Number(event.target.value)) } /> }
                </Flex>
            </Column>
            <hr className="m-0 bg-dark" />
            <Flex alignItems="center" gap={ 1 }>
                <input className="flash-wired-form-check-input" type="checkbox" id="uniqueRewards" checked={ uniqueRewards } onChange={ (e) => setUniqueRewards(e.target.checked) } />
                <Text>Unikke belønninger</Text>
            </Flex>
            <Text center  className="bg-muted rounded p-1">
                Hvis markeret vil hver belønning blive givet én gang til hver bruger. Dette vil deaktivere muligheden for sandsynligheder.
            </Text>
            <hr className="m-0 bg-dark" />
            <Flex justifyContent="between" alignItems="center">
                <Text gfbold>Præmier</Text>
                <Button variant="success" onClick={ addReward }>
                    <FontAwesomeIcon icon="plus" />
                </Button>
            </Flex>
            <Column gap={ 1 }>
                { rewards && rewards.map((reward, index) =>
                {
                    return (
                        <Flex key={ index } gap={ 1 }>
                            <Flex alignItems="center" gap={ 1 }>
                                <input className="flash-wired-form-check-input" type="checkbox" checked={ reward.isBadge } onChange={ (e) => updateReward(index, e.target.checked, reward.itemCode, reward.probability) } />
                                <Text >Skilt?</Text>
                            </Flex>
                            <input spellCheck="false" type="text" className="form-control form-control-sm" value={ reward.itemCode } onChange={ e => updateReward(index, reward.isBadge, e.target.value, reward.probability) } placeholder="Item Code" />
                            <input type="number" className="form-control form-control-sm" value={ reward.probability } onChange={ e => updateReward(index, reward.isBadge, reward.itemCode, Number(e.target.value)) } placeholder="Probability" />
                            { (index > 0) &&
                            <Button variant="danger" onClick={ event => removeReward(index) }>
                                <FontAwesomeIcon icon="trash" />
                            </Button> }
                        </Flex>
                    )
                }) }
            </Column>
        </WiredActionBaseView>
    );
}
