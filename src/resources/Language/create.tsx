import React from 'react';
import { Create, CreateProps, required, SimpleForm, TextInput, useRedirect } from 'react-admin';
import LanguageTitle from './title';

export default function LanguageCreate<T extends CreateProps>(props: T) {
    const redirectTo = useRedirect();
    const { basePath } = props;

    return (
        <Create
            {...props}
            title={<LanguageTitle />}
            onSuccess={() => {
                redirectTo(basePath || '/');
            }}
        >
            <SimpleForm>
                <TextInput source="code" validate={required()} />
                <TextInput source="name" validate={required()} />
            </SimpleForm>
        </Create>
    );
}
