import React from 'react';

import edit from './edit';
import { Resource } from 'react-admin';
import create from './create';
import list from './list';

export default <Resource name="languages" list={list} create={create} edit={edit} />;
