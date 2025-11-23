import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserModel } from '@/models/userModel';
import { getUserByIdService, deleteUserService } from '@/services/userService';
import { getErrorAlert, getSuccessAlert, getConfirmAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { FormEnum } from '@/enums/formEnum';
import useMainControllerContext from '../context';

const useFormDetailController = () => {
  const mainCtrl = useMainControllerContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = searchParams.get('id');

  const handleGetUser = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const result = await getUserByIdService(userId);
      setUser(result);
    } catch (error) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    await getConfirmAlert({
      title: 'Delete User',
      description: 'Are you sure you want to delete this user? This action cannot be undone.',
      onSubmit: async () => {
        try {
          await deleteUserService(userId);
          searchParams.delete('id');
          setSearchParams(searchParams);
          mainCtrl.handleChangeForm(null!);
          mainCtrl.handleRefresh();
          return { message: 'User deleted successfully' };
        } catch (error: any) {
          throw error;
        }
      },
    });
  };

  const handleEdit = () => {
    mainCtrl.handleChangeForm(FormEnum.EDIT);
  };

  useEffect(() => {
    handleGetUser();
  }, [userId]);

  return {
    user,
    loading,
    handleDelete,
    handleEdit,
    handleRefresh: handleGetUser,
  };
};

export default useFormDetailController;
