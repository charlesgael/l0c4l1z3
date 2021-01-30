import simpleRestProvider from 'ra-data-simple-rest';
import React, { FC } from 'react';
import { Admin } from 'react-admin';
import Entries from './resources/Entries';
import MissingKeys from './resources/MissingKeys';
import Language from './resources/Language';
import Namespace from './resources/Namespace';
import theme from './theme';

const dataProvider = simpleRestProvider('');
const App: FC = () => (
    <Admin dataProvider={dataProvider} theme={theme}>
        {Language}
        {Namespace}
        {Entries}
        {MissingKeys}
    </Admin>
);

export default App;
