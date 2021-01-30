import React from 'react';
import {
    CreateProps,
    Edit,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput,
    useRedirect,
} from 'react-admin';
import EntriesActions from './actions';
import EntriesTitle from './title';

export default function EntriesEdit<T extends CreateProps>(props: T) {
    const redirectTo = useRedirect();

    return (
        <Edit
            {...props}
            title={<EntriesTitle />}
            undoable={false}
            onSuccess={({ data }) => {
                redirectTo(`/namespaces/${data.ns}/show/${data.lng}`);
            }}
            actions={<EntriesActions />}
        >
            <SimpleForm>
                <ReferenceInput source="ns" reference="namespaces">
                    <SelectInput optionText="name" disabled />
                </ReferenceInput>
                <ReferenceInput source="lng" reference="languages">
                    <SelectInput optionText="name" disabled />
                </ReferenceInput>
                <TextInput source="key" disabled validate={required()} />
                <TextInput source="value" validate={required()} />
            </SimpleForm>
        </Edit>
    );
}
