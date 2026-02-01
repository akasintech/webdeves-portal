import type { User } from "./types"

const AUTH_TOKEN_KEY = "webdeves_auth_token"
const USER_DATA_KEY = "webdeves_user_data"

export const authUtils = {
  setAuth: (token: string, user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }
    return null
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(USER_DATA_KEY)
    }
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  },
}
