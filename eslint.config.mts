import type { OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config';
import antfu from '@antfu/eslint-config';
import oxlint from 'eslint-plugin-oxlint';

export const createConfig = (overrides: OptionsConfig & TypedFlatConfigItem = {}) => {
	const isDev = process.env.NODE_ENV === 'development';

	return antfu(
		{
			react: true,
			formatters: {
				css: true,
				html: true,
			},
			stylistic: {
				indent: 'tab',
			},
			ignores: [
				'**/dist/**',
				'**/node_modules/**',
			],
			rules: {
				'style/semi': [
					'error',
					'always',
					{
						omitLastInOneLineClassBody: true,
					},
				],
				'node/prefer-global/process': 'off',
				'no-console': isDev ? 'off' : 'warn',
				'no-debugger': isDev ? 'off' : 'error',
				'antfu/top-level-function': 'off',
				'antfu/if-newline': 'off',
				'import/no-default-export': 'error',
			},
			...overrides,
		},
		// ignore config files, as they usually require default exports
		{
			files: ['**/*.config.mts', '**/*.config.ts', '**/*.workspace.ts'],
			rules: {
				'import/no-default-export': 'off',
			},
		},
		oxlint.configs['flat/recommended'],
	);
};

export default createConfig();
