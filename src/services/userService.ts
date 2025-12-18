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
    const formData = new FormData();

    // Append all fields to FormData
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);

    if (data.phone) formData.append('phone', data.phone);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.department_id) formData.append('department_id', data.department_id);
    if (data.sector_id) formData.append('sector_id', data.sector_id);

    // Append profile picture if exists
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    // Let axios set the correct multipart boundary header automatically
    const res = await axiosInstance.post<UserResponse>('/v1/users', formData, {
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
    const formData = new FormData();

    // Append all fields to FormData if they exist
    if (data.username !== undefined) formData.append('username', data.username);
    if (data.email !== undefined) formData.append('email', data.email);
    if (data.password !== undefined) formData.append('password', data.password);
    if (data.role !== undefined) formData.append('role', data.role);
    if (data.phone !== undefined) formData.append('phone', data.phone);
    if (data.first_name !== undefined) formData.append('first_name', data.first_name);
    if (data.last_name !== undefined) formData.append('last_name', data.last_name);
    if (data.department_id !== undefined) formData.append('department_id', data.department_id);
    if (data.sector_id !== undefined) formData.append('sector_id', data.sector_id);

    // Append profile picture if exists
    if (data.profile_picture !== undefined && data.profile_picture !== null) {
      formData.append('profile_picture', data.profile_picture);
    }

    // Let axios set the correct multipart boundary header automatically
    const res = await axiosInstance.put<UserResponse>(`/v1/users/${id}`, formData, {
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
