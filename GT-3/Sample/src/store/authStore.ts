// src/store/authStore.ts -- NEW FILE
// The nav bar we build next has to know whether anyone is logged in. A
// store is a box any component can read from, without passing props.
import { create } from "zustand";
import { persist } from "zustand/middleware";
// The shape of the store: its data AND the functions that change it
interface AuthState {
token: string | null;
userName: string | null;
login: (name: string) => void;
logout: () => void;
}
// The store from Session 6, now wrapped in persist( ... )
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      login: (name) => set({ token: `demo-token-${name}`, userName: name }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth",
      partialize: (state: AuthState) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);
export default useAuthStore;
