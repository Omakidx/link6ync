import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
} from 'zustand/middleware';
import type { User } from '@/types';
import {
  login as loginApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  getCurrentUser,
  getAccessToken,
  removeAccessToken,
} from '@/lib/api';
import type { LoginRequest } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error:
    | string
    | null;

  // Actions
  login: (
    data: LoginRequest
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (
    user: User | null
  ) => void;
  setError: (
    error:
      | string
      | null
  ) => void;
  clearError: () => void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (
        set,
        get
      ) => ({
        user: null,
        isAuthenticated:
          false,
        isLoading:
          false,
        isInitialized:
          false,
        error:
          null,

        login:
          async (
            data: LoginRequest
          ) => {
            set(
              {
                isLoading:
                  true,
                error:
                  null,
              }
            );
            try {
              const response =
                await loginApi(
                  data
                );
              set(
                {
                  user: response.user,
                  isAuthenticated:
                    true,
                  isLoading:
                    false,
                  error:
                    null,
                }
              );
            } catch (error: any) {
              const message =
                error
                  .response
                  ?.data
                  ?.message ||
                'Login failed';
              set(
                {
                  isLoading:
                    false,
                  error:
                    message,
                }
              );
              throw new Error(
                message
              );
            }
          },

        logout:
          async () => {
            set(
              {
                isLoading:
                  true,
              }
            );
            try {
              await logoutApi();
            } catch (error) {
              // Continue with local logout even if API fails
              console.error(
                'Logout API error:',
                error
              );
            } finally {
              removeAccessToken();
              set(
                {
                  user: null,
                  isAuthenticated:
                    false,
                  isLoading:
                    false,
                  error:
                    null,
                }
              );
            }
          },

        refreshAuth:
          async () => {
            try {
              const response =
                await refreshTokenApi();
              set(
                {
                  user: response.user,
                  isAuthenticated:
                    true,
                }
              );
            } catch (error) {
              removeAccessToken();
              set(
                {
                  user: null,
                  isAuthenticated:
                    false,
                }
              );
            }
          },

        initialize:
          async () => {
            // If already initialized, skip
            if (get().isInitialized) {
              return;
            }

            const token =
              getAccessToken();

            if (
              !token
            ) {
              set(
                {
                  isInitialized:
                    true,
                  isAuthenticated:
                    false,
                  user: null,
                }
              );
              return;
            }

            // If we have persisted user data, use it immediately
            const currentUser = get().user;
            if (currentUser) {
              set({
                isInitialized: true,
                isAuthenticated: true,
              });
              
              // Refresh user data in background
              getCurrentUser()
                .then((response) => {
                  set({ user: response.user });
                })
                .catch(() => {
                  // Try refresh token
                  refreshTokenApi()
                    .then((response) => {
                      set({ user: response.user });
                    })
                    .catch(() => {
                      removeAccessToken();
                      set({
                        user: null,
                        isAuthenticated: false,
                      });
                    });
                });
              return;
            }

            set(
              {
                isLoading:
                  true,
              }
            );

            try {
              // Try to get current user with existing token
              const response =
                await getCurrentUser();
              set(
                {
                  user: response.user,
                  isAuthenticated:
                    true,
                  isLoading:
                    false,
                  isInitialized:
                    true,
                }
              );
            } catch (error: any) {
              // Token might be expired, try to refresh
              try {
                const refreshResponse =
                  await refreshTokenApi();
                set(
                  {
                    user: refreshResponse.user,
                    isAuthenticated:
                      true,
                    isLoading:
                      false,
                    isInitialized:
                      true,
                  }
                );
              } catch (refreshError) {
                // Both failed, clear auth state
                removeAccessToken();
                set(
                  {
                    user: null,
                    isAuthenticated:
                      false,
                    isLoading:
                      false,
                    isInitialized:
                      true,
                  }
                );
              }
            }
          },

        setUser:
          (
            user: User | null
          ) => {
            set(
              {
                user,
                isAuthenticated:
                  !!user,
              }
            );
          },

        setError:
          (
            error:
              | string
              | null
          ) => {
            set(
              {
                error,
              }
            );
          },

        clearError:
          () => {
            set(
              {
                error:
                  null,
              }
            );
          },
      }),
      {
        name: 'auth-storage',
        storage:
          createJSONStorage(
            () =>
              localStorage
          ),
        partialize:
          (
            state
          ) => ({
            user: state.user,
            isAuthenticated:
              state.isAuthenticated,
          }),
      }
    )
  );
