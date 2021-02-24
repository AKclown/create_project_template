import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import HomePage from '../pages/home.page';

// $ routes config
const routerConfig: Array<RouterType> = [{
    path: '/home',
    componentName: HomePage,
    name: '首屏页面',
    exact: true,
}];

export default routerConfig;

// $ router type 
export interface RouterType {
    path: string;
    componentName:React.ComponentType<any>| React.ComponentType<RouteComponentProps<any>>;
    name: string;
    exact?: boolean;
    // sub-router config
    routes?: Array<RouterType>;
}
