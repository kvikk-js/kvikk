import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";

export default [
	js.configs.recommended,
    {
		ignores: ["build/*", "pages/*", "components/*", "layouts/*"]
    },
	eslintConfigPrettier
];
