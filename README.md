[![BuildAndTest CI](https://github.com/VerzeFullStack/howard/actions/workflows/BuildAndTest.yml/badge.svg)](https://github.com/VerzeFullStack/howard/actions/workflows/BuildAndTest.yml)

[![Azure Static Web Apps](https://github.com/VerzeFullStack/howard/actions/workflows/azure-static-web-apps-agreeable-cliff-06fed350f.yml/badge.svg)](https://github.com/VerzeFullStack/howard/actions/workflows/azure-static-web-apps-agreeable-cliff-06fed350f.yml)

[![.NET](https://github.com/VerzeFullStack/howard/actions/workflows/dotnetbuild.yml/badge.svg)](https://github.com/VerzeFullStack/howard/actions/workflows/dotnetbuild.yml)

[![Build and deploy ASP.Net Core app to Azure Web App - fullstacke](https://github.com/VerzeFullStack/howard/actions/workflows/main_fullstacke.yml/badge.svg)](https://github.com/VerzeFullStack/howard/actions/workflows/main_fullstacke.yml)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
