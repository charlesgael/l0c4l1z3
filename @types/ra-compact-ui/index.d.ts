declare module 'ra-compact-ui' {
    import { BoxProps } from '@material-ui/core/Box';
    // import { CardContentInner } from 'ra-ui-materialui';
    import { GridProps } from '@material-ui/core/Grid';
    import { FC } from 'react';
    import { Record } from 'react-admin';

    export interface CompactShowLayoutProps {
        basePath?: string;
        record?: Record;
        resource?: string;
        version?: number;
        className?: string;
        layoutComponentName?: string;
    }

    export const CompactShowLayout: FC<CompactShowLayoutProps>;
    export const GridShowLayout: FC<CompactShowLayoutProps>;
    export const BoxedShowLayout: FC<CompactShowLayoutProps>;

    export const RaBox: FC<{ props?: BoxProps }>;
    export const RaGrid: FC<GridProps>;
}
