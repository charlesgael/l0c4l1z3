import React, { FC } from 'react';

const EntriesTitle: FC<{
    record?: {
        ns: string;
        lng: string;
    };
}> = ({ record }) => {
    return <span> Translation {record && `"${record.ns}:${record.lng}"`}</span>;
};

export default EntriesTitle;
