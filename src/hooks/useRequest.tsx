import React, { useEffect, useState } from 'react';
import { DataProviderProxy, Error, Loading, NotFound, useDataProvider } from 'react-admin';

export default function useRequest<T>(fn: (dataProvider: DataProviderProxy) => Promise<T>) {
    const dataProvider = useDataProvider();
    const [value, setValue] = useState<undefined | T>();
    const [beforeDisplay, setBeforeDisplay] = useState<JSX.Element | null>(<Loading />);

    useEffect(() => {
        fn(dataProvider)
            .then((res) => {
                setValue(res);
                if (res) setBeforeDisplay(null);
                else setBeforeDisplay(<NotFound />);
            })
            .catch((err) => {
                setBeforeDisplay(<Error error={err} />);
            });
    }, []);

    return {
        beforeDisplay,
        value,
    };
}
