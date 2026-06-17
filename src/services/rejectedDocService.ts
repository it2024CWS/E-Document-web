import axiosInstance from '@/configs/axios';

export interface RejectedDocFilters {
  dept_id?: string;
  start_date?: string;
  end_date?: string;
}

export const rejectedDocService = {
  getRejectedDocs: async (page: number = 1, limit: number = 10, filters?: RejectedDocFilters) => {
    const params: Record<string, any> = { page, limit };
    if (filters?.dept_id) params.dept_id = filters.dept_id;
    if (filters?.start_date) params.start_date = filters.start_date;
    if (filters?.end_date) params.end_date = filters.end_date;

    const response = await axiosInstance.get('/v1/rejected-docs', { params });
    return response.data;
  },
};
