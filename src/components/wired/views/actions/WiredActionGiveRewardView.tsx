import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveRewardView: FC<{}> = props =>
{
    const [ isOpen, setIsOpen ] = useState(false);
    const [ limitEnabled, setLimitEnabled ] = useState(false);
    const [ rewardTime, setRewardTime ] = useState(1);
    const [ uniqueRewards, setUniqueRewards ] = useState(false);
    const [ rewardsLimit, setRewardsLimit ] = useState(1);
    const [ limitationInterval, setLimitationInterval ] = useState(1);
    const [ rewards, setRewards ] = useState<{ isBadge: boolean, itemCode: string, probability: number }[]>([]);
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    const addReward = () => setRewards(rewards => [ ...rewards, { isBadge: false, itemCode: '', probability: null } ]);

    function handleSelectClick() {
        setIsOpen(!isOpen);
    }

    function handleSelectBlur() {
        setIsOpen(false);
    }
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

    const handleNext = () => {
        setRewardsLimit(rewardsLimit + 1);
    }

    const handlePrev = () => {
        setRewardsLimit(rewardsLimit - 1);
    }
    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Flex className='mb-1' alignItems="center" gap={ 1 }>
                <input className="flash-wired-form-check-input" type="checkbox" id="limitEnabled" onChange={ event => setLimitEnabled(event.target.checked) } />
                <Text>{ LocalizeText('wiredfurni.params.prizelimit', [ 'amount' ], [ limitEnabled ? rewardsLimit.toString() : '' ]) }</Text>
            </Flex>
            { !limitEnabled &&
                <Text className='wired-reward-text'>Præmie-grænse ikke fastsat.</Text> }
            { limitEnabled &&
            <Flex className='mb-1 wired-slider-buttons'>
                <Button disabled={ ((rewardsLimit === 1)) } className="notification-buttons help-button-size" onClick={ handlePrev }>
                    <i className="icon button-prev"/>
                </Button>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 1000 }
                    value={ rewardsLimit }
                    onChange={ event => setRewardsLimit(event) } />
                <Button disabled={ ((rewardsLimit === 1000)) } className="notification-buttons help-button-size" onClick={ handleNext }>
                    <i className="icon button-next"/>
                </Button>
            </Flex>}
            <Column className={rewardTime === 0 ? 'wired-input-bottom' : ''} gap={ 1 }>
                <hr className="m-0 color-dark" />
                <Text className='wired-align' gfbold>Hvor ofte kan en bruger belønnes?</Text>
                <Column gap={ 1 }>
                    <select className={`form-select form-select-sm ${isOpen ? 'active' : ''}`} value={ rewardTime } onChange={ (e) => setRewardTime(Number(e.target.value)) } onClick={handleSelectClick} onBlur={handleSelectBlur}>
                        <option value="0">Èn gang</option>
                        <option value="3">Èn gang hver { limitationInterval } minutter</option>
                        <option value="2">Èn gang hver { limitationInterval } timer</option>
                        <option value="1">Èn gang hver { limitationInterval } dage</option>
                    </select>
                    { (rewardTime > 0) && <input type="number" className="form-control wired-form" value={ limitationInterval } onChange={ event => setLimitationInterval(Number(event.target.value)) } /> }
                </Column>
            </Column>
            <hr className="m-0 color-dark" />
            <Flex alignItems="center" gap={ 1 }>
                <input className="flash-wired-form-check-input" type="checkbox" id="uniqueRewards" checked={ uniqueRewards } onChange={ (e) => setUniqueRewards(e.target.checked) } />
                <Text>Unikke belønninger</Text>
            </Flex>
            <Text className='wired-text'>
                Hvis markeret vil hver belønning blive givet én gang til hver bruger. Dette vil deaktivere muligheden for sandsynligheder.
            </Text>
            <hr className="m-0 color-dark" />
            <Flex justifyContent="between" alignItems="center">
                <Text gfbold>Præmier</Text>
                <Base pointer onClick={ addReward }><FontAwesomeIcon icon="plus" /></Base>
            </Flex>
            <Flex fullWidth>
                <Text>Skilt?</Text>
                <Text className='wired-align2'>Skilt/møbel kode</Text>
                <Text className='wired-align2'>Sandsynlighed</Text>
            </Flex>
            <Column className='mb-1' gap={ 1 }>
                { rewards && rewards.map((reward, index) =>
                {
                    return (
                        <Flex alignItems="center" className={index === 0 ? 'wired-margin' : ''} key={ index } gap={ 1 }>
                            <input className="flash-wired-form-check-input wired-checkbox-margin2" type="checkbox" checked={ reward.isBadge } onChange={ (e) => updateReward(index, e.target.checked, reward.itemCode, reward.probability) } />
                            <input spellCheck="false" type="text" className="form-control wired-form" value={ reward.itemCode } onChange={ e => updateReward(index, reward.isBadge, e.target.value, reward.probability) } />
                            <input type="number" className="form-control wired-form" value={ reward.probability } onChange={ e => updateReward(index, reward.isBadge, reward.itemCode, Number(e.target.value)) }/>
                            { (index > 0) &&
                            <Base pointer onClick={ event => removeReward(index) }><FontAwesomeIcon icon="x" /></Base> }
                        </Flex>
                    )
                }) }
            </Column>
        </WiredActionBaseView>
    );
}
