import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Column, Text } from '../../../common';
import { useWired } from '../../../hooks';

export const WiredFurniSelectorView: FC<{}> = props =>
{
    const { trigger = null, furniIds = [] } = useWired();

    return (
        <Column className='wired-help-bottom wired-align' gap={ 1 }>
            <Text gfbold>{ LocalizeText('wiredfurni.pickfurnis.caption', [ 'count', 'limit' ], [ furniIds.length.toString(), trigger.maximumItemSelectionCount.toString() ]) }</Text>
            <Text>{ LocalizeText('wiredfurni.pickfurnis.desc') }</Text>
        </Column>
    );
}
