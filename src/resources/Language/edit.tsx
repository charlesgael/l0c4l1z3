import React from 'react';
import { Edit, EditProps, required, SimpleForm, TextInput } from 'react-admin';
import LanguageTitle from './title';

export default function LanguageEdit<T extends EditProps>(props: T) {
    return (
        <Edit {...props} title={<LanguageTitle />}>
            <SimpleForm>
                <TextInput source="id" disabled />
                <TextInput source="code" validate={required()} />
                <TextInput source="name" validate={required()} />
            </SimpleForm>
        </Edit>
    );
}
