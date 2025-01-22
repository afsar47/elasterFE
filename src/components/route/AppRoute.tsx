import { useEffect, useCallback } from 'react';
import {
    setLayout,
    setPreviousLayout,
    setCurrentRouteKey,
    useAppSelector,
    useAppDispatch,
} from '@/store';
import { useLocation } from 'react-router-dom';
import type { LayoutType } from '@/@types/theme';
import type { ComponentType, FC } from 'react';

export type AppRouteProps<T> = {
    component?: ComponentType<T>; // Make component optional
    routeKey: string;
    layout?: LayoutType;
};

const AppRoute: FC<AppRouteProps<any>> = ({
    component: Component,
    routeKey,
    ...props
}) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const layoutType = useAppSelector((state) => state.theme.layout.type);
    const previousLayout = useAppSelector(
        (state) => state.theme.layout.previousType
    );

    const handleLayoutChange = useCallback(() => {
        dispatch(setCurrentRouteKey(routeKey));

        if (props.layout && props.layout !== layoutType) {
            dispatch(setPreviousLayout(layoutType));
            dispatch(setLayout(props.layout));
        }

        if (!props.layout && previousLayout && layoutType !== previousLayout) {
            dispatch(setLayout(previousLayout));
            dispatch(setPreviousLayout(''));
        }
    }, [dispatch, layoutType, previousLayout, props.layout, routeKey]);

    useEffect(() => {
        handleLayoutChange();
    }, [location, handleLayoutChange]);

    // Check if the component is defined; if not, return a fallback UI
    if (!Component) {
        console.error(`Component for route ${routeKey} is undefined.`);
        return <div>404 - Component Not Found</div>; // or a proper Not Found component
    }

    return <Component {...(props as any)} />;
};

export default AppRoute;
