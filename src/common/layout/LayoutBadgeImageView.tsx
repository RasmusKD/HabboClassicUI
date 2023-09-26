import { BadgeImageReadyEvent, NitroEventDispatcher, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { GetConfiguration, GetSessionDataManager, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../api';
import { Base, BaseProps } from '../Base';
import { Text } from '../../common';

export interface LayoutBadgeImageViewProps extends BaseProps<HTMLDivElement>
{
    badgeCode: string;
    isGroup?: boolean;
    showInfo?: boolean;
    customTitle?: string;
    isGrayscale?: boolean;
    scale?: number;
}

export const LayoutBadgeImageView: FC<LayoutBadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null, isGrayscale = false, scale = 1, classNames = [], style = {}, children = null, ...rest } = props;
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'badge-image' ];

        if(isGroup) newClassNames.push('group-badge');

        if(isGrayscale) newClassNames.push('grayscale');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, isGroup, isGrayscale ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(imageElement)
        {
            newStyle.backgroundImage = `url(${ (isGroup) ? imageElement.src : GetConfiguration<string>('badge.asset.url').replace('%badgename%', badgeCode.toString())})`;

            if(scale !== 1)
            {
                newStyle.transform = `scale(${ scale })`;

                if(!(scale % 1)) newStyle.imageRendering = 'pixelated';
            }
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ badgeCode, isGroup, imageElement, scale, style ]);

    useEffect(() =>
    {
        if(!badgeCode || !badgeCode.length) return;

        let didSetBadge = false;

        const onBadgeImageReadyEvent = async (event: BadgeImageReadyEvent) =>
        {
            if(event.badgeId !== badgeCode) return;

            const element = await TextureUtils.generateImage(new NitroSprite(event.image));

            element.onload = () => setImageElement(element);

            didSetBadge = true;

            NitroEventDispatcher.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
        }

        NitroEventDispatcher.addEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);

        const texture = isGroup ? GetSessionDataManager().getGroupBadgeImage(badgeCode) : GetSessionDataManager().getBadgeImage(badgeCode);

        if(texture && !didSetBadge)
        {
            (async () =>
            {
                const element = await TextureUtils.generateImage(new NitroSprite(texture));

                element.onload = () => setImageElement(element);
            })();
        }

        return () => NitroEventDispatcher.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
    }, [ badgeCode, isGroup ]);

    const BadgeInformationView = (props: { title: string, description: string }) =>
    {
        const { title = null, description = null } = props;

        if(!GetConfiguration('badge.descriptions.enabled', true)) return null;

        return (
            <Base className="badge-information text-black pt-2 px-2 pb-4">
                <div className="mb-1 pb-1">{ title }</div>
                <div className="badge-desc">{ description }</div>
            </Base>
        );
    };

    return (
        <Base classNames={ getClassNames } style={ getStyle } { ...rest }>
            { (showInfo && GetConfiguration<boolean>('badge.descriptions.enabled', true)) &&
                <Base className="badge-information text-black p-2">
                    <Text gfbold className="mb-1">{ isGroup ? customTitle : LocalizeBadgeName(badgeCode) }</Text>
                    <div className="badge-desc">{ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) }</div>
                </Base> }
            { children }
        </Base>
    );
}
