import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                cash: {
                    50: '#f5fbf3',
                    100: '#e4f8e2',
                    200: '#c3efc4',
                    300: '#92e2a2',
                    400: '#5ccc7f',
                    500: '#37ae6d',
                    600: '#279066',
                    700: '#23715c',
                    800: '#205b53',
                    900: '#1c494a',
                    950: '#0a2329'
                }
            }
        }
    }
}
