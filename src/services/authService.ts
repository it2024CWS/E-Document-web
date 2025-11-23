import axiosInstance from '@/configs/axios';
import { AUTH_ENDPOINT } from '@/configs/endpoint';
import { AuthModel, RefreshTokenModel, ProfileModel, LoginResponseModel, UserDataModel } from '@/models/authModel';
import { AUTH_TOKEN_STORAGE } from '@/utils/constants/localStorage';
import { encode, decode } from '@/utils/functions/hashString';
import api from "@/configs/axios";

export const loginService = async (usernameOrEmail: string, password: string): Promise<UserDataModel> => {
  try {
    const res = await axiosInstance.post<LoginResponseModel>(
      '/v1/auth/login',
      { usernameOrEmail, password },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Login failed');
    }

    // JWT token is stored in cookies by backend
    // We only need to return user data
    return res.data.data;
  } catch (error: any) {
    console.error('Login error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });

    // Extract error message from response
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error?.response?.status === 401) {
      throw new Error('Invalid username or password');
    }

    if (error?.message) {
      throw new Error(error.message);
    }

    throw new Error('Login failed. Please try again.');
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    const res = await axiosInstance.post(
      '/v1/auth/logout',
      {},
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Logout failed');
    }
  } catch (error: any) {
    console.log('Failed to logout: ', error);
    throw error?.response?.data?.message || error?.message || 'Logout failed';
  }
};

export const refreshTokenService = async (refresh_token: string): Promise<RefreshTokenModel> => {
  try {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${refresh_token}`;
    const res = await api.post(
      '/auth/refresh-token',
      { refresh_token },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    return res?.data?.data as RefreshTokenModel;
  } catch (error) {
    console.log('Failed to get new session: ', error);
    throw error;
  }
};

export const getUserProfileService = async (): Promise<ProfileModel> => {
  try {
    const res = await axiosInstance(`/${AUTH_ENDPOINT}/account/details`);
    return res?.data?.info as ProfileModel;
  } catch (error) {
    console.log('Failed to get user profile: ', error);
    throw error;
  }
};

export const changePasswordService = async (old_password: string, new_password: string, confirm_password: string): Promise<void> => {
  try {
    // Get access token from localStorage
    const tokenData = localStorage.getItem(AUTH_TOKEN_STORAGE);
    let accessToken = '';
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      accessToken = decode(parsed.accessToken);
    }
    await api.put(
      `${import.meta.env.VITE_API_KEY}/change-password`,
      {
        old_password,
        new_password,
        confirm_password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
  } catch (error) {
    console.log('Failed to change password: ', error);
    throw error;
  }
};
