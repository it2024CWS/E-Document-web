import { FormEnum } from '@/enums/formEnum';
import { UserModel } from '@/models/userModel';
import { PaginationModel } from '@/models/paginationModel';
import { getUsersService } from '@/services/userService';
import { getUserProfilePictureUrl } from '@/services/fileService';
import { getErrorAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useMainController = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentForm, setCurrentForm] = useState<FormEnum>(null!);
  const [data, setData] = useState<{ info: UserModel[]; pagination?: PaginationModel }>(null!);
  const [loading, setLoading] = useState<boolean>(true);

  const page = parseInt(searchParams.get('page') ?? '1');
  const rowPerPage = parseInt(searchParams.get('rowPerPage') ?? '10');
  const searchQuery = searchParams.get('query') ?? undefined;

  const handleGetData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUsersService(page, rowPerPage, searchQuery);

      // Set data immediately for fast initial render
      setData({ info: result.items, pagination: result.pagination });
      setLoading(false);

      // Load profile pictures in background (non-blocking)
      // Each picture updates the state individually as it loads
      result.items.forEach((user) => {
        if (user.profile_picture && user.id) {
          // Use setTimeout to push to background/next tick
          setTimeout(async () => {
            try {
              const profilePictureUrl = await getUserProfilePictureUrl(user.id, user.profile_picture);
              if (profilePictureUrl) {
                // Update only this user's profile picture in state
                setData((prevData) => {
                  if (!prevData) return prevData;
                  return {
                    ...prevData,
                    info: prevData.info.map((u) =>
                      u.id === user.id ? { ...u, profile_picture: profilePictureUrl } : u
                    ),
                  };
                });
              }
            } catch (error) {
              console.error('Failed to load profile picture for user:', user.id, error);
            }
          }, 0);
        }
      });
    } catch (error) {
      getErrorAlert(error);
      setLoading(false);
    }
  }, [page, rowPerPage, searchQuery]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCurrentForm(FormEnum.DETAIL);
    } else {
      setCurrentForm(null!);
      handleGetData();
    }
  }, [searchParams, page, rowPerPage, searchQuery]);

  const handleChangeSelectedItem = useCallback((value: UserModel) => {
    if (!value?.id) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('id');
        return newParams;
      });
      setCurrentForm(null!);
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('id', value?.id);
        return newParams;
      });
      setCurrentForm(FormEnum.DETAIL);
    }
  }, [setSearchParams]);

  const handleChangeSearchQuery = useCallback((value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (!value) newParams.delete('query');
      else newParams.set('query', value);
      return newParams;
    });
  }, [setSearchParams]);

  const handleChangeForm = useCallback((value: FormEnum) => {
    setCurrentForm(value);
  }, []);

  const handleChangePage = useCallback((value: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', value.toString());
      return newParams;
    });
  }, [setSearchParams]);

  const handleChangeRowPerPage = useCallback((value: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('rowPerPage', value.toString());
      return newParams;
    });
  }, [setSearchParams]);

  const handleRefresh = useCallback(() => {
    handleGetData();
  }, [handleGetData]);

  return {
    data,
    loading,
    currentForm,
    // NOTE: toolbar, query & basic select function
    page,
    rowPerPage,
    searchQuery,
    handleChangeSelectedItem,
    handleChangeSearchQuery,
    handleChangeForm,
    handleChangePage,
    handleChangeRowPerPage,
    handleRefresh,
  };
};

export default useMainController;