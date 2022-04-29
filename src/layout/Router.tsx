import React, { createContext, ReactNode, createElement, useContext, useState, FunctionComponent, HTMLAttributes, AnchorHTMLAttributes } from 'react';

const DEFAULT_ROUTE = '/1inch-trade';

interface Props {
    /**
     * Specifies all URLs and their respectful components.
     */
    routes: {
        [DEFAULT_ROUTE]: ReactNode;
        [key: string]: ReactNode;
    };
}

/**
 * Stores current URL of the router and allows to change it programmatically.
 */
export const RouterContext = createContext<{ route: string, setRoute: (route: string) => void }>(
    { route: DEFAULT_ROUTE, setRoute: (_: string) => undefined });

/**
 * Oversimplified router component.
 */
export const Router = ({ routes }: Props) => {
    const [route, setRoute] = useState(DEFAULT_ROUTE);

    return (
        <RouterContext.Provider value={{ route, setRoute }}>
            {routes[route]}
        </RouterContext.Provider>
    );
};

export const RouteComponent = (props: { component: FunctionComponent<{}> }) =>
    createElement(props.component, null);

/**
 * Render anchor with click handler to switch route based on `href` attribute.
 * We intentionally override final `href`, so links within widget won't lead to actual
 * pages on website.
 */
export const RouteLink = ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <RouterContext.Consumer>
        {({ setRoute }) => (
            <a href='javascript:' onClick={() => href && setRoute(href)} {...rest}>{children}</a>
        )}
    </RouterContext.Consumer>
);

export const useRouter = () => useContext(RouterContext);