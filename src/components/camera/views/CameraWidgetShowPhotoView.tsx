import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetUserProfile, IPhotoData, LocalizeText } from '../../../api';
import { Base, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';

export interface CameraWidgetShowPhotoViewProps
{
    currentIndex: number;
    currentPhotos: IPhotoData[];
}

export const CameraWidgetShowPhotoView: FC<CameraWidgetShowPhotoViewProps> = props =>
{
    const { currentIndex = -1, currentPhotos = null } = props;
    const [ imageIndex, setImageIndex ] = useState(0);

    const currentImage = (currentPhotos && currentPhotos.length) ? currentPhotos[imageIndex] : null;

    const next = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue + 1);

            if(newIndex >= currentPhotos.length) newIndex = 0;

            return newIndex;
        });
    }

    const previous = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue - 1);

            if(newIndex < 0) newIndex = (currentPhotos.length - 1);

            return newIndex;
        });
    }

    useEffect(() =>
    {
        setImageIndex(currentIndex);
    }, [ currentIndex ]);

    if(!currentImage) return null;

    return (
            <NitroCardContentView justifyContent="center">
        { (currentPhotos.length === 1) &&
            <Flex justifyContent="center">
            <Flex center className="picture-preview border border-black" style={ currentImage.w ? { backgroundImage: 'url(' + currentImage.w + ')' } : {} }>
                { !currentImage.w &&
                    <Text bold>{ LocalizeText('camera.loading') }</Text> }
            </Flex>
            </Flex> }
            { (currentPhotos.length > 1) &&
            <Flex justifyContent="between">
                <Flex className="cursor-pointer camera-arrow-left" onClick={ previous } />
                <Flex center className="picture-preview border border-black" style={ currentImage.w ? { backgroundImage: 'url(' + currentImage.w + ')' } : {} }>
                    { !currentImage.w &&
                        <Text bold>{ LocalizeText('camera.loading') }</Text> }
                </Flex>
                <Flex className="cursor-pointer camera-arrow-right" onClick={ next } />
                </Flex> }
                <Flex className="camera-text-margin" alignItems="center" justifyContent="between">
                    <Text small underline pointer onClick={ event => GetUserProfile(currentImage.s)}>{ (currentImage.n || 'Habboclassic.dk - Stop stjæl mullah') }</Text>
                    <Text small>{ new Date(currentImage.t).toISOString().replace(/T.*/,'').split('-').reverse().join('-') }</Text>
                </Flex>
                { currentImage.m && currentImage.m.length &&
                    <Flex className="camera-text-margin" alignItems="center">
                        <Text small className="camera-text-padding">{ LocalizeText('habboclassic.dk.roompicture')}</Text>
                        <Text small underline pointer onClick={ event => CreateLinkEvent('navigator/goto/' + currentImage.i) }>{ currentImage.m }</Text>
                    </Flex> }
                </NitroCardContentView>
    );
}
