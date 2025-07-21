import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    testStore() {
      console.log("[Auth Store] Test store action called");
      console.log("[Auth Store] Current state:", this.authenticated);
    },
  },
});
