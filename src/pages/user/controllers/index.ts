import { FormEnum } from '@/enums/formEnum';
import { UserModel } from '@/models/userModel';
import { PaginationModel } from '@/models/paginationModel';
import { getUsersService } from '@/services/userService';
import { getErrorAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useMainController = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentForm, setCurrentForm] = useState<FormEnum>(null!);
  const [data, setData] = useState<{ info: UserModel[]; pagination?: PaginationModel }>(null!);
  const [loading, setLoading] = useState<boolean>(true);

  const page = parseInt(searchParams.get('page') ?? '1');
  const rowPerPage = parseInt(searchParams.get('rowPerPage') ?? '10');
  const searchQuery = searchParams.get('query') ?? undefined;

  const handleGetData = async () => {
    try {
      setLoading(true);
      const result = await getUsersService(page, rowPerPage, searchQuery);
      setData({ info: result.items, pagination: result.pagination });
    } catch (error) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCurrentForm(FormEnum.DETAIL);
    } else {
      setCurrentForm(null!);
      handleGetData();
    }
  }, [searchParams, page, rowPerPage, searchQuery]);

  return {
    data,
    loading,
    currentForm,
    // NOTE: toolbar, query & basic select function
    page,
    rowPerPage,
    searchQuery,
    handleChangeSelectedItem: (value: UserModel) => {
      if (!value?.id) {
        searchParams.delete('id');
        setSearchParams(searchParams);
        setCurrentForm(null!);
      } else {
        searchParams.set('id', value?.id);
        setSearchParams(searchParams);
        setCurrentForm(FormEnum.DETAIL);
      }
    },
    handleChangeSearchQuery: (value: string) => {
      if (!value) searchParams.delete('query');
      else searchParams.set('query', value);
      setSearchParams(searchParams);
    },
    handleChangeForm: (value: FormEnum) => setCurrentForm(value),
    handleChangePage: (value: number) => {
      searchParams.set('page', value.toString());
      setSearchParams(searchParams);
    },
    handleChangeRowPerPage: (value: number) => {
      searchParams.set('rowPerPage', value.toString());
      setSearchParams(searchParams);
    },
    handleRefresh: () => handleGetData(),
  };
};

export default useMainController;