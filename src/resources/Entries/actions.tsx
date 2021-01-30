import React, { FC } from 'react';
import { TopToolbar, Button, Link } from 'react-admin';

const EntriesActions: FC<{
    data?: {
        ns: string;
        lng: string;
    };
}> = ({ data, ...props }) => {
    return (
        <TopToolbar>
            {data && (
                <Button
                    component={Link}
                    to={{
                        pathname: `/namespaces/${data.ns}/show/${data.lng}`,
                    }}
                    label="Back"
                />
            )}
        </TopToolbar>
    );
};

export default EntriesActions;
