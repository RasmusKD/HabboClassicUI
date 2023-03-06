import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureExternalImageWidget } from '../../../../hooks';
import { CameraWidgetShowPhotoView } from '../../../camera/views/CameraWidgetShowPhotoView';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const { objectId = -1, currentPhotoIndex = -1, currentPhotos = null, onClose = null } = useFurnitureExternalImageWidget();

    if((objectId === -1) || (currentPhotoIndex === -1)) return null;

    return (
        <NitroCardView className="nitro-external-image-widget no-resize drag-handler" theme="Camera">
            <NitroCardHeaderView headerText="" onCloseClick={ onClose } />
                <CameraWidgetShowPhotoView currentIndex={ currentPhotoIndex } currentPhotos={ currentPhotos } />
        </NitroCardView>
    );
}
