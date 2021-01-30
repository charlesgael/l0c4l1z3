import React from 'react';

// import show from './show';

import edit from './edit';
import { Resource } from 'react-admin';
import create from './create';
import list from './list';

export default <Resource name="entries" create={create} edit={edit} />;
