import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreateUserRequest } from '@/models/userModel';
import { DepartmentModel } from '@/models/departmentModel';
import { SectorModel } from '@/models/sectorModel';
import { createUserService, updateUserService, getUserByIdService } from '@/services/userService';
import { departmentService } from '@/services/departmentService';
import { sectorService } from '@/services/sectorService';
import { roleService } from '@/services/roleService';
import { getUserProfilePictureUrl, clearCachedProfilePicture } from '@/services/fileService';
import { getErrorAlert, getSuccessAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { FormEnum } from '@/enums/formEnum';
import useMainControllerContext from '../context';

const useFormCreateController = () => {
  const mainCtrl = useMainControllerContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateUserRequest & { password?: string }>({
    username: '',
    email: '',
    password: '',
    role_id: '', // Default or empty
    phone: '',
    firstname: '',
    lastname: '',
    department_id: '',
    sector_id: '',
    profile_picture: null,
    is_active: 'true', // UI uses string for Select
    nickname: '',
  });
  const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(null);

  // Master Data States
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [sectors, setSectors] = useState<SectorModel[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const userId = searchParams.get('id');
  const isEditMode = mainCtrl.currentForm === FormEnum.EDIT;

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchDepartments = async () => {
    try {
      // Fetch with large limit for dropdown
      const resp = await departmentService.getAllDepartments(1, 100);
      if (resp && resp.items) {
        setDepartments(resp.items);
      }
    } catch (error) {
      console.error("Failed to load departments", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const resp = await roleService.getAllRoles(1, 100);
      if (resp && resp.items) {
        setRoles(resp.items);
      }
    } catch (error) {
      console.error('Failed to load roles', error);
    }
  };

  const fetchSectors = async (deptId: string) => {
    try {
      const resp = await sectorService.getSectorsByDepartment(deptId);
      if (resp) {
        setSectors(resp);
      } else {
        setSectors([]);
      }
    } catch (error) {
      console.error("Failed to load sectors", error);
      setSectors([]);
    }
  };

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
        role_id: user.role_id,
        phone: user.phone || '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        department_id: user.department_id ? user.department_id.toString() : '',
        sector_id: user.sector_id ? user.sector_id.toString() : '',
        profile_picture: null,
        is_active: user.is_active ? 'true' : 'false',
        nickname: user.nickname || '',
      });

      // Load sectors if department is present
      if (user.department_id) {
        // Ensure department_id is treated as string
        fetchSectors(user.department_id.toString());
      }

      // Set current profile picture URL for display
      setCurrentProfilePicture(profilePictureUrl ?? user.profile_picture ?? null);
    } catch (error) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateUserRequest | 'password', value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // If department changes, clear sector and fetch new sectors
      if (field === 'department_id') {
        newData.sector_id = '';
        if (value) {
          fetchSectors(value as string);
        } else {
          setSectors([]);
        }
      }

      return newData;
    });
  };

  const handleProfilePictureChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, profile_picture: file }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);

      // Validation
      if (!formData.username || !formData.email) {
        throw new Error('Username and email are required');
      }

      if (!formData.role_id) {
        throw new Error('Role is required');
      }

      if (formData.department_id && !formData.sector_id) {
        // Optional: Enforce sector selection if department is selected
      }

      if (!isEditMode && !formData.password) {
        throw new Error('Password is required');
      }

      // Convert string IDs to numbers for submission if needed, 
      // but the API might expect numbers. The formData has them as string from inputs.
      // Let's ensure we send what API expects.

      const submitData: any = { ...formData };

      // Convert IDs to strings or null
      submitData.department_id = formData.department_id ? formData.department_id : null;
      submitData.sector_id = formData.sector_id ? formData.sector_id : null;
      submitData.role_id = formData.role_id;
      submitData.is_active = formData.is_active === 'true'; // Convert back to boolean for API
      submitData.nickname = formData.nickname;

      if (isEditMode && userId) {
        // Edit mode
        if (!submitData.password) {
          delete submitData.password; // Don't update password if not provided
        }

        // Clear cached profile picture if a new one is being uploaded
        if (formData.profile_picture) {
          clearCachedProfilePicture(userId);
        }

        await updateUserService(userId, submitData);
        await getSuccessAlert('User updated successfully');
        mainCtrl.handleChangeForm(FormEnum.DETAIL);
      } else {
        // Create mode
        await createUserService(submitData);
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
    departments,
    sectors,
    roles,
    handleChange,
    handleProfilePictureChange,
    handleSubmit,
    handleCancel,
  };
};

export default useFormCreateController;
