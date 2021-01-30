import React from 'react';
import { Datagrid, EditButton, List, ListProps, TextField } from 'react-admin';

import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .column-code': {
            width: 100,
        },
        '& .column-undefined': {
            width: 1,
        },
    },
}));

export default function EntriesList<T extends ListProps>(props: T): JSX.Element {
    const classes = useStyles();

    return (
        <List {...props} className={classes.root}>
            <Datagrid>
                <TextField source="lng" />
                <TextField source="key" />
                <TextField source="value" />
                <EditButton />
            </Datagrid>
        </List>
    );
}
