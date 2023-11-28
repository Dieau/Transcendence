import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8000/graphql",
  documents: ["./src/graphql/*.graphql"],
  generates: {
    "./src/graphql/graphql-operations.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-vue-apollo",
      ],
      config: {
        withCompositionFunctions: true,
        vueCompositionApiImportFrom: "vue",
      },
    },
  

  },
};

export default config;
