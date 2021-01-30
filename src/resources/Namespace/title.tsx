import React, { FC } from 'react';

const NamespaceTitle: FC<{
    record?: {
        name: string;
    };
}> = ({ record }) => {
    return <span> Namespace {record && `"${record.name}"`}</span>;
};

export default NamespaceTitle;
