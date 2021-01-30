import { createMuiTheme } from '@material-ui/core';
import { blue, lightBlue } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: lightBlue[500],
        },
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none',
            },
        },
    },
});

export default theme;
