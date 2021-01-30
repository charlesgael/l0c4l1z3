import { Grid, LinearProgress } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC } from 'react';
import { Datagrid, EditButton, List, ListProps, TextField } from 'react-admin';

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

export const LanguageProgress: FC<{
    source: string;
    record?: {
        lines: number;
        total: number;
    };
}> = ({ record: { lines, total } = {} }) => {
    if (lines === undefined || total === undefined) return null;

    return (
        <Grid container alignItems="center" spacing={3}>
            <Grid item xs={8}>
                <LinearProgress variant="determinate" value={total === 0 ? 100 : (lines / total) * 100} />
            </Grid>
            <Grid item xs={4}>
                {lines} / {total}
            </Grid>
        </Grid>
    );
};

export default function LanguageList<T extends ListProps>(props: T): JSX.Element {
    const classes = useStyles();

    return (
        <List {...props} className={classes.root}>
            <Datagrid>
                <TextField source="code" />
                <TextField source="name" />
                <LanguageProgress source="progress" />
                <EditButton />
            </Datagrid>
        </List>
    );
}
