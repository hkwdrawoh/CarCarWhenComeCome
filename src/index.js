import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from "./App";
import { ChakraProvider, extendTheme, defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
    baseStyle: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: 'xl',
    },
    sizes: {
        lg: {
            fontSize: 'lg',
            px: 2,
            h: 10,
        },
        xl: {
            fontSize: 'xl',
            px: 4,
        },
        xxl: {
            fontSize: '3xl',
            px: 4,
            py: 2,
        },
        xxxl: {
            fontSize: '4xl',
            px: 2,
            py: 2,
        },
    },
    variants: {
        outline: {
            border: '2px solid',
            borderColor: 'cyan.600',
            _hover: {bg: '#505050'},
            _active: {bg: '#707070'}
        },
        ghost: {
            _hover: {bg: '#505050'},
            _active: {bg: '#707070'}
        }
    },
    defaultProps: {
        size: 'lg',
        variant: 'outline',
        colorScheme: 'cyan'
    },
})

const theme = extendTheme({
    styles: {
        global: {
            body: {
                background: "var(--BackColor1)",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.9rem",
                margin: "0",
                padding: "0",
                // boxSizing: "border-box",
            },
            h1: {
                fontSize: "2rem",
                fontWeight: "bold",
            },
            h2: {
                fontSize: "1.35rem",
                fontWeight: "bold",
            },
            h3: {
                fontSize: "1.06rem",
                fontWeight: "bold",
            },
            p: {
                fontSize: "0.9rem",
            },
        }
    },
    components: {
        Button,
    }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme} resetCSS>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);

