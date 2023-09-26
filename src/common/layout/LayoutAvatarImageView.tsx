import { AvatarScaleType, AvatarSetType } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { GetAvatarRenderManager } from '../../api';
import { Base, BaseProps } from '../Base';

export interface LayoutAvatarImageViewProps extends BaseProps<HTMLDivElement>
{
    figure: string;
    gender?: string;
    headOnly?: boolean;
    direction?: number;
    scale?: number;
    cropTransparency?: boolean;
    onImageLoad?: (height: number) => void;
}

export const LayoutAvatarImageView: FC<LayoutAvatarImageViewProps> = props =>
{
    const { figure = '', gender = 'M', headOnly = false, direction = 0, scale = 1, cropTransparency = false, classNames = [], style = {}, onImageLoad, ...rest } = props; // Add onImageLoad here
    const [ avatarUrl, setAvatarUrl ] = useState<string>(null);
    const [ randomValue, setRandomValue ] = useState(-1);
    const isDisposed = useRef(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'avatar-image' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(avatarUrl && avatarUrl.length) newStyle.backgroundImage = `url('${ avatarUrl }')`;

        if(scale !== 1)
        {
            newStyle.transform = `scale(${ scale })`;

            if(!(scale % 1)) newStyle.imageRendering = 'pixelated';
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ avatarUrl, scale, style ]);

useEffect(() => {
    const avatarImage = GetAvatarRenderManager().createAvatarImage(
        figure,
        AvatarScaleType.LARGE,
        gender,
        {
            resetFigure: (figure) => {
                if (isDisposed.current) return;
                setRandomValue(Math.random());
            },
            dispose: () => {},
            disposed: false,
        },
        null
    );

    if (!avatarImage) return;

    let setType = AvatarSetType.FULL;

    if (headOnly) setType = AvatarSetType.HEAD;

    avatarImage.setDirection(setType, direction);

    (async () =>
    {
        const image = await avatarImage.getCroppedImage(setType);

        if (image && cropTransparency) {
            const croppedImage = new Image();
            croppedImage.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = croppedImage.width;
            canvas.height = croppedImage.height;
            ctx.drawImage(croppedImage, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let top = canvas.height;
            let left = canvas.width;
            let right = 0;
            let bottom = 0;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const alpha = data[(y * canvas.width + x) * 4 + 3];
                    if (alpha > 0) {
                        if (x < left) left = x;
                        if (y < top) top = y;
                        if (x > right) right = x;
                        if (y > bottom) bottom = y;
                    }
                }
            }
            const croppedWidth = right - left + 1;
            const croppedHeight = bottom - top + 1;
            const croppedCanvas = document.createElement('canvas');
            const croppedCtx = croppedCanvas.getContext('2d');
            croppedCanvas.width = croppedWidth;
            croppedCanvas.height = croppedHeight;
            croppedCtx.drawImage(croppedImage, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
            const croppedImageUrl = croppedCanvas.toDataURL();
            setAvatarUrl(croppedImageUrl);
            onImageLoad && onImageLoad(croppedHeight);;
        }
        croppedImage.src = image.src;
    }
    if(image && !cropTransparency) {
        image.onload = function() {
            setAvatarUrl(image.src);
            onImageLoad && onImageLoad(image.height);
        };
    }
    })();
}, [figure, gender, direction, headOnly, randomValue]);

    useEffect(() =>
    {
        isDisposed.current = false;

        return () =>
        {
            isDisposed.current = true;
        }
    }, []);

    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />;
}
