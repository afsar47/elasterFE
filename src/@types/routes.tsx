import { LayoutType } from './theme'
import type { LazyExoticComponent, ReactNode } from 'react'

export interface Meta {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    header?: string | ReactNode
    headerContainer?: boolean
    extraHeader?: LazyExoticComponent<() => JSX.Element>
    footer?: boolean
    layout?: LayoutType
}

export interface Route {
    key: string;
    path: string;
    component?: React.LazyExoticComponent<React.FC<any>>; // Allow lazy components
    authority: string[];
    meta?: {
        title: string;
        // Add other meta properties as needed
    };
    children?: Route[]; // For nested routes
}

export type Routes = Route[]
