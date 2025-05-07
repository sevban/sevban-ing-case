import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';

const copyConfig = {
    targets: [
        { src: 'node_modules/@webcomponents', dest: 'dist/node_modules' },
        { src: 'src/assets', dest: 'dist' },
        { src: 'index.html', dest: 'dist' },
    ],
};

const config = {
    input: 'src/employee-table.js',
    output: {
        dir: 'dist',
        format: 'es',
    },
    plugins: [
        minifyHTML.default(),
        copy(copyConfig),
        nodeResolve(),
    ],
    preserveEntrySignatures: false,
};


if (process.env.NODE_ENV !== 'development') {
    config.plugins.push(terser());
}

export default config;