import type { User } from "@/graphql/graphql-operations"
import { defineStore } from "pinia"

interface IState {
    user: null | User
  }
  
  export const useAuthStore = defineStore(`Auth`, {
    state: (): IState =>
      ({
        user: null,
      }),
    getters: {
      isConnected: (state) => state.user !== null,
    },
    actions: {
      setConnected(user: User, token: string) {
        this.setDisconnected()
        this.user = user
        localStorage.setItem(`token`, token)
      },
      setDisconnected() {
        if (this.user === null) return 
        this.user = null
        localStorage.removeItem(`token`)
      }
    },
  })