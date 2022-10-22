import { Box, createTheme } from '@mui/material';
import { styled } from '@mui/system';

const typographyTheme = createTheme({
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        title: {
            fontSize: 'clamp(3.625rem, 1.2857rem + 3.5714vw, 4rem)',
        },
        h1: {
            fontSize: '1.3rem',
            fontWeight: '400'
        },
        h2: {
            fontSize: '1rem',
            fontWeight: '400',
            marginBottom: '10px!important'
        },
        h3: {
            fontSize: 28
        },
        h4: {
            fontSize: 26
        },
        h5: {
            fontSize: 24
        },
        h6: {
            fontSize: 22
        },
        body1: {
            fontSize: 20,
        },
        body2: {
            fontSize: 18,
        },
        caption: {
            fontSize: 16
        },
    }
});

const theme = createTheme({
    palette: {
        primary: {
            main: '#307ECC',
            light: "#6FAED9",
            dark: "#0b222f"
        },
        secondary: {
            main: "#fd7e14",
        },
        default: {
            main: '#555',
            light: '#B6B6B6',
            dark: '#333',
        },
        blackish: {
            main: "#001320",
            light: "#00406c"
        },
        white: {
            main: '#fff',
        },
        background: {
            main: '#E4E6E9'
        },
    },
    typography: typographyTheme.typography,
    components: {
        MuiButton: {
            defaultProps: {
                size: 'medium',
            },
            styleOverrides: {
                root: {
                    borderRadius: 5,
                    textTransform: 'initial',
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                size: 'small'
            },
            styleOverrides: {
                root: {
                    fontSize: 14,
                    borderRadius: 0,
                    margin: '5px 0 10px 0'
                },
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: 15
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 3
                },
                input: {
                    fontSize: 15
                },
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 3
            }
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 5,
                    boxShadow: "none",
                }
            }
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    borderRadius: 5,
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: 10
                }
            }
        },
        MuiCheckbox: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    padding: 0
                }
            }
        },
        MuiRadio: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    padding: 0
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    marginLeft: 0,
                },
                label: {
                    fontSize: 16,
                    marginLeft: 5
                }
            }
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    background: '#00000042',
                },
            },
        }
    }
});

export const StyledBoxContainer = styled(Box)(() => ({
    marginRight: 20,
    border: '1px solid rgb(204, 204, 204)',
    boxShadow: '0px 0px 5px #eaeaea',
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        padding: '10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    "& form": {
        flex: 1,
        padding: 10,
        "& .form-controle": {
            marginBottom: '5px',
        }
    },
    "& .footer": {
        display: 'flex',
        padding: 10,
        justifyContent: 'flex-end',
        borderTop: '1px solid rgb(238, 237, 237)',
    }
}));


export default theme;