import { FormEnum } from '@/enums/formEnum';
import { LinkModel } from '@/models/linkModel';
import { PaginationModel } from '@/models/paginationModel';
import { getErrorAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useMainController = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentForm, setCurrentForm] = useState<FormEnum>(null!);
  const [data, setData] = useState<{ info: LinkModel[]; pagination?: PaginationModel }>(null!);
  const [loading, setLoading] = useState<boolean>(true);

  const page = parseInt(searchParams.get('page') ?? '1');
  const rowPerPage = parseInt(searchParams.get('rowPerPage') ?? '10');
  const startDate = searchParams.get('startDate') ?? undefined;
  const endDate = searchParams.get('endDate') ?? undefined;
  const searchQuery = searchParams.get('query') ?? undefined;

  const handleGetData = async () => {
    try {
      setLoading(true);
      setData({ info: [{ id: 'AAAA' }] });
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
  }, [searchParams, page, rowPerPage, startDate, endDate]);

  return {
    data,
    loading,
    currentForm,
    // NOTE: toolbar, query & basic select function
    page,
    rowPerPage,
    startDate,
    endDate,
    searchQuery,
    handleChangeSelectedItem: (value: LinkModel) => {
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
    handleChangeStartDate: (value: string) => {
      if (!value) searchParams.delete('startDate');
      else searchParams.set('startDate', value);
      setSearchParams(searchParams);
    },
    handleChangeEndDate: (value: string) => {
      if (!value) searchParams.delete('endDate');
      else searchParams.set('endDate', value);
      setSearchParams(searchParams);
    },
    handleChangeSearchParams: (value: string) => setSearchParams(value !== null ? { detail: value } : {}),
  };
};

export default useMainController;
