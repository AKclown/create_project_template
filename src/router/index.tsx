import React from 'react';
import { HashRouter, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import routerConfig, { RouterType } from './router.config';

// $ router component
function AppRouter() {
    // Render routing components
    function renderComponent(
        Component: React.ComponentType<RouteComponentProps<any>>
            | React.ComponentType<any>
            | React.ComponentType<{ routes: Array<RouterType> }>,
        routeProps: RouteComponentProps<any>,
        routes?: Array<RouterType>) {
        /**
         * 1.Determine whether there are sub-routes in the current route object
         */
        if (routes) {
            return <Component {...routeProps} routes={routes} />
        } else {
            return <Component {...routeProps} />
        }
    }
    
    return (
        <HashRouter>
            <Switch>
                {
                    routerConfig.map(({ path, componentName, exact = true, routes }, index) => {
                        return (
                            <Route
                                key={index}
                                exact={exact}
                                path={path}
                                render={(routeProps) => renderComponent(componentName, routeProps, routes)}
                            />
                        )
                    })
                }
                <Redirect from='/*' to='/home' />
            </Switch>
        </HashRouter >
    );
};
export default AppRouter;