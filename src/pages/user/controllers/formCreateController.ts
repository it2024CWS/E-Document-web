import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreateUserRequest, UpdateUserRequest } from '@/models/userModel';
import { createUserService, updateUserService, getUserByIdService } from '@/services/userService';
import { getUserProfilePictureUrl, clearCachedProfilePicture } from '@/services/fileService';
import { getErrorAlert, getSuccessAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { FormEnum } from '@/enums/formEnum';
import useMainControllerContext from '../context';

const useFormCreateController = () => {
  const mainCtrl = useMainControllerContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: '',
    role: 'Employee',
    phone: '',
    first_name: '',
    last_name: '',
    department_id: '',
    sector_id: '',
    profile_picture: null,
  });
  const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(null);

  const userId = searchParams.get('id');
  const isEditMode = mainCtrl.currentForm === FormEnum.EDIT;

  const handleLoadUserForEdit = async () => {
    if (!userId || !isEditMode) return;

    try {
      setLoading(true);
      const user = await getUserByIdService(userId);

      // Load presigned URL for existing profile picture and cache by user id
      let profilePictureUrl: string | null = null;
      if (user.profile_picture) {
        try {
          profilePictureUrl = await getUserProfilePictureUrl(userId, user.profile_picture);
        } catch (error) {
          console.error('Failed to load profile picture URL', error);
        }
      }

      setFormData({
        username: user.username,
        email: user.email,
        password: '', // Don't load password
        role: user.role,
        phone: user.phone || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        department_id: user.department_id || '',
        sector_id: user.sector_id || '',
        profile_picture: null,
      });
      // Set current profile picture URL for display
      setCurrentProfilePicture(profilePictureUrl ?? user.profile_picture ?? null);
    } catch (error) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, profile_picture: file }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (!formData.username || !formData.email) {
        throw new Error('Username and email are required');
      }

      if (!isEditMode && !formData.password) {
        throw new Error('Password is required');
      }

      if (isEditMode && userId) {
        // Edit mode
        const updateData: UpdateUserRequest = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if not provided
        }

        // Clear cached profile picture if a new one is being uploaded
        if (formData.profile_picture) {
          clearCachedProfilePicture(userId);
        }

        await updateUserService(userId, updateData);
        await getSuccessAlert('User updated successfully');
        mainCtrl.handleChangeForm(FormEnum.DETAIL);
      } else {
        // Create mode
        await createUserService(formData);
        await getSuccessAlert('User created successfully');
        searchParams.delete('id');
        setSearchParams(searchParams);
        mainCtrl.handleChangeForm(null!);
        mainCtrl.handleRefresh();
      }
    } catch (error) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      mainCtrl.handleChangeForm(FormEnum.DETAIL);
    } else {
      searchParams.delete('id');
      setSearchParams(searchParams);
      mainCtrl.handleChangeForm(null!);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      handleLoadUserForEdit();
    }
  }, [userId, isEditMode]);

  return {
    formData,
    loading,
    isEditMode,
    currentProfilePicture,
    handleChange,
    handleProfilePictureChange,
    handleSubmit,
    handleCancel,
  };
};

export default useFormCreateController;
