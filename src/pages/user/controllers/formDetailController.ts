import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserModel } from '@/models/userModel';
import { getUserByIdService, deleteUserService } from '@/services/userService';
import { getUserProfilePictureUrl } from '@/services/fileService';
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

      // If user has profile picture path, get presigned URL and cache it by user id
      let profilePictureUrl: string | null = null;
      if (result.profile_picture) {
        try {
          profilePictureUrl = await getUserProfilePictureUrl(userId, result.profile_picture);
        } catch (error) {
          console.error('Failed to load profile picture URL', error);
        }
      }

      setUser({
        ...result,
        profile_picture: profilePictureUrl ?? result.profile_picture,
      });
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
