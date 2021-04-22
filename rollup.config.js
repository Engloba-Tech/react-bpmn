import pkg from './package.json';
import dts from 'rollup-plugin-dts';
import css from 'rollup-plugin-import-css';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

const umdGlobals = pkg.peerDependencies || {};

const commonjsOptions = {
	include: 'node_modules/**',
	// left-hand side can be an absolute path, a path
	// relative to the current directory, or the name
	// of a module in node_modules
	namedExports: {
		'node_modules/react/index.js': [
			'cloneElement',
			'createContext',
			'Component',
			'createElement',
		],
		'node_modules/react-dom/index.js': ['render', 'hydrate'],
		'node_modules/react-is/index.js': [
			'isElement',
			'isFragment',
			'isValidElementType',
			'ForwardRef',
			'Memo',
		],
	},
};

module.exports = [
	{
		input: './typings/index.d.ts',
		output: {
			file: 'dist/index.d.ts',
			format: 'umd',
			name: 'englobityTypes',
			globals: umdGlobals,
			sourcemap: 'inline',
			exports: 'named',
		},
		plugins: [dts()],
	},
	{
		input: './src/index.js',
		output: {
			file: 'dist/index.js',
			format: 'umd',
			name: 'react-bpmn',
			globals: umdGlobals,
			sourcemap: 'inline',
			exports: 'named',
		},
		external: Object.keys(umdGlobals),
		plugins: [
			nodeResolve(),
			commonjs(commonjsOptions),
			babel({ exclude: '**/node_modules/**' }),
			terser(),
			css(),
		],
	},
	{
		input: 'src/index.css',
		output: {
			file: 'dist/es/index.css',
			format: 'es',
		},
		plugins: [
			postcss({
				extract: true,
			}),
		],
	},
];
