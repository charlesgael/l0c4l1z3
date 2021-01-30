import React, { FC } from 'react';

const LanguageTitle: FC<{
    record?: {
        name: string;
    };
}> = ({ record }) => {
    return <span> Language {record && `"${record.name}"`}</span>;
};

export default LanguageTitle;
