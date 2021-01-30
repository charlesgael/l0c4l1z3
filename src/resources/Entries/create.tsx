import React, { FC } from 'react';
import {
    Create,
    CreateProps,
    NotFound,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput,
    useRedirect,
} from 'react-admin';
import EntriesActions from './actions';
import EntriesTitle from './title';
import { useLocation } from 'react-router';
import qs from 'qs';

export default function EntriesCreate<T extends CreateProps>(props: T) {
    const redirectTo = useRedirect();
    const location = useLocation<{
        record?: {
            ns: string;
            lng: string;
        };
    }>();

    const res = qs.parse(location.search.substring(1));
    const source = typeof res.source === 'string' ? JSON.parse(res.source) : {};
    const data = location.state?.record
        ? location.state.record
        : typeof source.ns === 'string' && typeof source.lng === 'string'
        ? {
              ns: source.ns as string,
              lng: source.lng as string,
          }
        : undefined;

    if (!data) return <NotFound />;

    return (
        <Create
            {...props}
            title={<EntriesTitle />}
            onSuccess={({ data }) => {
                redirectTo(`/namespaces/${data.ns}/show/${data.lng}`);
            }}
            actions={<EntriesActions data={data} />}
        >
            <SimpleForm>
                <ReferenceInput source="ns" reference="namespaces">
                    <SelectInput optionText="name" disabled />
                </ReferenceInput>
                <ReferenceInput source="lng" reference="languages">
                    <SelectInput optionText="name" disabled />
                </ReferenceInput>
                <TextInput source="key" validate={required()} />
                <TextInput source="value" validate={required()} />
            </SimpleForm>
        </Create>
    );
}
