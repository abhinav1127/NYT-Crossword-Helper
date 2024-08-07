const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");

module.exports = [
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"@typescript-eslint": typescript,
			prettier: prettier,
		},
		rules: {
			...typescript.configs["recommended"].rules,
			...prettier.configs.recommended.rules,
		},
	},
];
