import { computed } from "vue";
import { useAuthStore } from "../store/auth";

export const useAuth = () => {
  const authStore = useAuthStore();

  const testAuthComposable = () => {
    console.log("[Auth Composable] Test action called");
    authStore.testStore();
  };

  return {
    // State
    // user: computed(() => authStore.user),
    isAuthenticated: authStore.authenticated,

    // Actions
    testAuthComposable,
  };
};
