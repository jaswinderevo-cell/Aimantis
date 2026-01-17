import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn", // <-- change from "error" to "warn"
        {
          argsIgnorePattern: "^_", // ignore unused args starting with _
          varsIgnorePattern: "^_", // ignore unused vars starting with _
          caughtErrorsIgnorePattern: "^_", // ignore unused catch vars starting with _
        },
      ],
      // Formatting rules
      indent: ["error", 2],
      semi: ["error", "always"],
      quotes: ["off"],
      "comma-dangle": ["error", "always-multiline"],
      "max-len": ["warn", { code: 500 }],
      "space-infix-ops": "error",
      "space-before-blocks": "error",
      "keyword-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "eol-last": ["error", "always"],
    },
  }
);
