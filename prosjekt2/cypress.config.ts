import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://it2810-14.idi.ntnu.no/project2",
  },
  defaultCommandTimeout: 6000,
});
