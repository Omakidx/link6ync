import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

const API_URL =
  process
    .env
    .NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

// Create axios instance
const api: AxiosInstance =
  axios.create(
    {
      baseURL:
        API_URL,
      withCredentials:
        true,
      headers:
        {
          'Content-Type':
            'application/json',
        },
    }
  );

// Token storage key
const ACCESS_TOKEN_KEY =
  'accessToken';

// Get access token from storage
export const getAccessToken =
  ():
    | string
    | null => {
    if (
      typeof window !==
      'undefined'
    ) {
      return localStorage.getItem(
        ACCESS_TOKEN_KEY
      );
    }
    return null;
  };

// Set access token in storage
export const setAccessToken =
  (
    token: string
  ): void => {
    if (
      typeof window !==
      'undefined'
    ) {
      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        token
      );
    }
  };

// Remove access token from storage
export const removeAccessToken =
  (): void => {
    if (
      typeof window !==
      'undefined'
    ) {
      localStorage.removeItem(
        ACCESS_TOKEN_KEY
      );
    }
  };

// Request interceptor to add auth token
api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const token =
      getAccessToken();
    if (
      token &&
      config.headers
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (
    error
  ) => {
    return Promise.reject(
      error
    );
  }
);

// Response interceptor for token refresh
let isRefreshing =
  false;
let failedQueue: Array<{
  resolve: (
    value: unknown
  ) => void;
  reject: (
    reason?: unknown
  ) => void;
}> =
  [];

const processQueue =
  (
    error: Error | null,
    token:
      | string
      | null = null
  ) => {
    failedQueue.forEach(
      (
        prom
      ) => {
        if (
          error
        ) {
          prom.reject(
            error
          );
        } else {
          prom.resolve(
            token
          );
        }
      }
    );
    failedQueue =
      [];
  };

api.interceptors.response.use(
  (
    response
  ) =>
    response,
  async (
    error: AxiosError
  ) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    // If error is 401 and we haven't retried yet
    if (
      error
        .response
        ?.status ===
        401 &&
      !originalRequest._retry
    ) {
      if (
        isRefreshing
      ) {
        // Wait for the token refresh to complete
        return new Promise(
          (
            resolve,
            reject
          ) => {
            failedQueue.push(
              {
                resolve,
                reject,
              }
            );
          }
        )
          .then(
            (
              token
            ) => {
              if (
                originalRequest.headers
              ) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return api(
                originalRequest
              );
            }
          )
          .catch(
            (
              err
            ) => {
              return Promise.reject(
                err
              );
            }
          );
      }

      originalRequest._retry =
        true;
      isRefreshing =
        true;

      try {
        const response =
          await api.post(
            '/auth/refresh'
          );
        const {
          accessToken,
        } =
          response.data;

        setAccessToken(
          accessToken
        );
        processQueue(
          null,
          accessToken
        );

        if (
          originalRequest.headers
        ) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(
          originalRequest
        );
      } catch (refreshError) {
        processQueue(
          refreshError as Error,
          null
        );
        removeAccessToken();

        // Redirect to login if not already there
        if (
          typeof window !==
            'undefined' &&
          !window.location.pathname.includes(
            '/auth'
          )
        ) {
          window.location.href =
            '/auth/login';
        }
        return Promise.reject(
          refreshError
        );
      } finally {
        isRefreshing =
          false;
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;
