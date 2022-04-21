import { h } from 'preact';
import { Configurations } from './models';
import Main from './layout/Main';
import { WidgetProviders } from './context';

export const App = ({ ...appSettings }: Configurations) => (
    <WidgetProviders config={appSettings}>
        <Main />
    </WidgetProviders>
);
