import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    // Existing UI effects intentionally reset navigation and intro state. A
    // behavioral refactor belongs in a separate frontend change.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "node_modules/**",
    "public/media/cms/**",
    "src/payload-types.ts",
    "worker-configuration.d.ts",
  ]),
]);
