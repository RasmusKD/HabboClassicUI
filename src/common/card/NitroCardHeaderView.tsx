import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, MouseEvent, useMemo } from 'react';
import { Base, Column, ColumnProps, Flex } from '..';
import { Text } from '../../common';

interface NitroCardHeaderViewProps extends ColumnProps
{
    headerText: string;
    isGalleryPhoto?: boolean;
    noCloseButton?: boolean;
    onReportPhoto?: (event: MouseEvent) => void;
    onCloseClick: (event: MouseEvent) => void;
}

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, isGalleryPhoto = false, noCloseButton = false, onReportPhoto = null, onCloseClick = null, justifyContent = 'center', alignItems = 'center', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'drag-handler', 'container-fluid', 'nitro-card-header' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    return (
        <Column center position="relative" classNames={ getClassNames } { ...rest }>
            <Flex fullWidth className="nitro-card-header-holder">
            <span className="nitro-card-header-text">{ headerText }</span>
                { isGalleryPhoto &&
                    <Base position="absolute" className="nitro-camera-report" onClick={ onReportPhoto }></Base>
                }
                <Base position="absolute" className="end-2 nitro-card-header-close" onMouseDownCapture={ onMouseDown } onClick={ onCloseClick }>
                </Base>
            </Flex>
        </Column>
    );
}
