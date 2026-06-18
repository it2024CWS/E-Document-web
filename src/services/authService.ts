import axiosInstance from '@/configs/axios';
import { AUTH_ENDPOINT } from '@/configs/endpoint';
import { RefreshTokenModel, ProfileModel, LoginResponseModel, UserDataModel } from '@/models/authModel';
import { AUTH_TOKEN_STORAGE } from '@/utils/constants/localStorage';
import { decode } from '@/utils/functions/hashString';
import api from "@/configs/axios";

export const loginService = async (usernameOrEmail: string, password: string): Promise<UserDataModel> => {
  const res = await axiosInstance.post<LoginResponseModel>(
    '/v1/auth/login',
    { usernameOrEmail, password },
    { headers: { 'ngrok-skip-browser-warning': 'true' } }
  );
  return res.data.data;
};

export const logoutService = async (): Promise<void> => {
  await axiosInstance.post(
    '/v1/auth/logout',
    {},
    { headers: { 'ngrok-skip-browser-warning': 'true' } }
  );
};

export const refreshTokenService = async (): Promise<RefreshTokenModel> => {
  const res = await axiosInstance.post('/v1/auth/refresh');
  return res?.data?.data as RefreshTokenModel;
};

export const getUserProfileService = async (): Promise<ProfileModel> => {
  const res = await axiosInstance(`/${AUTH_ENDPOINT}/account/details`);
  return res?.data?.info as ProfileModel;
};

export const changePasswordService = async (old_password: string, new_password: string, confirm_password: string): Promise<void> => {
  try {
    const tokenData = localStorage.getItem(AUTH_TOKEN_STORAGE);
    let accessToken = '';
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      accessToken = decode(parsed.accessToken);
    }
    await api.put(
      `${import.meta.env.VITE_API_KEY}/change-password`,
      { old_password, new_password, confirm_password },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
