import axiosInstance from '@/configs/axios';
import { UserModel, CreateUserRequest, UpdateUserRequest } from '@/models/userModel';
import { PaginationModel } from '@/models/paginationModel';

interface GetUsersResponse {
  success: boolean;
  message: string;
  error_code: string;
  data: {
    items: UserModel[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface UserResponse {
  success: boolean;
  message: string;
  error_code: string;
  data: UserModel;
}

export const getUsersService = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ items: UserModel[]; pagination: PaginationModel }> => {
  try {
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }

    const res = await axiosInstance.get<GetUsersResponse>('/v1/users', {
      params,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Failed to fetch users');
    }

    return {
      items: res.data.data.items,
      pagination: {
        total: res.data.data.pagination.totalItems,
      },
    };
  } catch (error: any) {
    console.error('Get users error:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error?.response?.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(error?.message || 'Failed to fetch users');
  }
};

export const getUserByIdService = async (id: string): Promise<UserModel> => {
  try {
    const res = await axiosInstance.get<UserResponse>(`/v1/users/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Failed to fetch user');
    }

    return res.data.data;
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error?.message || 'Failed to fetch user');
  }
};

export const createUserService = async (data: CreateUserRequest): Promise<UserModel> => {
  try {
    const res = await axiosInstance.post<UserResponse>('/v1/users', data, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Failed to create user');
    }

    return res.data.data;
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error?.message || 'Failed to create user');
  }
};

export const updateUserService = async (id: string, data: UpdateUserRequest): Promise<UserModel> => {
  try {
    const res = await axiosInstance.put<UserResponse>(`/v1/users/${id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Failed to update user');
    }

    return res.data.data;
  } catch (error: any) {
    console.error('Update user error:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error?.message || 'Failed to update user');
  }
};

export const deleteUserService = async (id: string): Promise<void> => {
  try {
    const res = await axiosInstance.delete(`/v1/users/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Failed to delete user');
    }
  } catch (error: any) {
    console.error('Delete user error:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error?.message || 'Failed to delete user');
  }
};
