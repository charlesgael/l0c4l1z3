import { Box, Card, CardContent, CardHeader } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { BoxedShowLayout, RaBox } from 'ra-compact-ui';
import React, { FC, MouseEvent } from 'react';
import {
    Button,
    Datagrid,
    EditButton,
    Error,
    Link,
    List,
    Loading,
    NotFound,
    ReferenceManyField,
    Show,
    ShowProps,
    Tab,
    TabbedShowLayout,
    TextField,
    useDelete,
    useListContext,
    useQuery,
    useRedirect,
} from 'react-admin';
import { useHistory } from 'react-router';
import { LanguageProgress } from '../Language/list';
import NamespaceTitle from './title';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .column-code': {
            width: 100,
        },
        '& .column-key': {
            width: 200,
        },
        '& .column-undefined': {
            width: 1,
        },
    },
    panel: {
        width: 320,
        minHeight: 450,
    },
    main: {
        borderRight: 'solid thin',
        paddingRight: theme.spacing(1),
        marginRight: theme.spacing(2),
    },
    errorButton: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: fade(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
    langBox: {
        width: 300,
        margin: '0.5em',
        display: 'inline-block',
        verticalAlign: 'top',
        cursor: 'pointer',

        '&:hover': {
            background: theme.palette.grey[50],
        },
    },
}));

const Delete: FC<{
    record?: {
        id: string;
        ns: string;
        lng: string;
    };
}> = ({ record, ...props }) => {
    const classes = useStyles();
    const redirectTo = useRedirect();
    const [deleteOne, { loading }] = useDelete('entries', record?.id || -1);

    if (!record) return null;
    return (
        <Button
            {...props}
            className={classes.errorButton}
            onClickCapture={() => {
                deleteOne();
                redirectTo(false);
            }}
            label="Delete"
            disabled={loading}
        >
            <DeleteIcon />
        </Button>
    );
};

const AddNewEntryButton: FC<{
    ns: string;
    lng: string;
}> = ({ ns, lng }) => {
    return (
        <Button
            component={Link}
            to={{
                pathname: '/entries/create',
                state: { record: { ns, lng } },
            }}
            label="Create"
        >
            <AddIcon />
        </Button>
    );
};

const LanguageTab: FC<{
    ns: string;
    lng: {
        id: string;
        name: string;
        code: string;
    };
    path: string;
}> = ({ ns, lng, ...rest }) => {
    const classes = useStyles();
    const redirectTo = useRedirect();
    const history = useHistory();

    const { loaded, error, data: missingKeys } = useQuery({
        type: 'getList',
        resource: 'missingKeys',
        payload: {
            pagination: {
                page: 0,
                perPage: 0,
            },
            sort: {
                field: 'key',
                order: 'ASC',
            },
            filter: { ns, lng: lng.id },
        },
    });

    const missingKey = (key: string) => (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        redirectTo(`/entries/create?source=${JSON.stringify({ ns, lng: String(lng.id), key })}`);
    };

    return (
        <Tab {...rest} path={String(lng.id)} label={lng.name} key={lng.code}>
            <ReferenceManyField
                addLabel={false}
                reference="entries"
                target="ns"
                sort={{ field: 'key', order: 'ASC' }}
                filter={{ lng: lng.id }}
            >
                <BoxedShowLayout>
                    <RaBox props={{ display: 'flex' }}>
                        <RaBox props={{ flexGrow: 1, className: classes.main }}>
                            <Datagrid className={classes.root}>
                                <TextField source="key" />
                                <TextField source="value" />
                                <EditButton />
                                <Delete />
                            </Datagrid>
                            <AddNewEntryButton ns={ns} lng={String(lng.id)} />
                        </RaBox>
                        <Box flexShrink={1} className={classes.panel}>
                            <h3>Keys without translations</h3>
                            {!loaded ? (
                                <i>Loading...</i>
                            ) : error ? (
                                <Error error={error} />
                            ) : (
                                missingKeys.map((it: { id: string; key: string }) => (
                                    <Button
                                        key={it.id}
                                        onClick={missingKey(it.key)}
                                        label={it.key}
                                        basePath="entries"
                                    ></Button>
                                ))
                            )}
                        </Box>
                    </RaBox>
                </BoxedShowLayout>
            </ReferenceManyField>
        </Tab>
    );
};

const LanguageGrid: FC<{
    containerPath?: string;
}> = (props) => {
    const { data, basePath } = useListContext<{
        id: string;
        name: string;
        code: string;
        lines: number;
        total: number;
    }>();
    const redirectTo = useRedirect();
    const classes = useStyles();

    return (
        <div>
            {data &&
                Object.values(data).map((it) => (
                    <Card
                        key={it.id}
                        className={classes.langBox}
                        onClick={() => redirectTo(`${props.containerPath || basePath}/show/${it.id}`)}
                    >
                        <CardHeader
                            title={<TextField record={it} source="name" />}
                            subheader={<TextField record={it} source="code" />}
                        />
                        <CardContent>
                            <LanguageProgress record={it} source="progress" />
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
};

export default function NamespaceShow<T extends ShowProps>(props: T) {
    const { id: ns, basePath } = props;
    const { loaded, error, data } = useQuery({
        type: 'getList',
        resource: 'languages',
        payload: {
            pagination: {
                page: 1,
                perPage: 50,
            },
            sort: {
                field: 'code',
                order: 'ASC',
            },
            filter: {},
        },
    });

    if (!loaded) return <Loading />;
    if (error) return <Error error={error} />;
    if (!ns) return <NotFound />;

    return (
        <Show {...props} title={<NamespaceTitle />}>
            <TabbedShowLayout>
                <Tab label="Overview">
                    <ReferenceManyField
                        addLabel={false}
                        reference="languages"
                        target="ns"
                        sort={{ field: 'code', order: 'ASC' }}
                        page={1}
                        perPage={50}
                    >
                        <LanguageGrid containerPath={`${basePath}/${ns}`} />
                    </ReferenceManyField>
                </Tab>
                {data.map((it: { id: string; name: string; code: string }) => (
                    <LanguageTab key={it.id} ns={ns} lng={it} path={it.id} />
                ))}
            </TabbedShowLayout>
        </Show>
    );
}
