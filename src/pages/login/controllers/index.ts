import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginService } from '@/services/authService';
import { UserDataModel } from '@/models/authModel';
import { getErrorAlert, getSuccessAlert } from '@/utils/functions/sweetAlert/sweetAlert';
import { useAuth } from '@/contexts/auth';
import { getDefaultPathForRole } from '@/enums/userRoleEnum';

const useMainController = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      usernameOrEmail: '',
      password: '',
    };

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = t('auth.usernameOrEmailRequired');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }

    setErrors(newErrors);
    return !newErrors.usernameOrEmail && !newErrors.password;
  };

  const handleChange = (field: 'usernameOrEmail' | 'password') => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const userData: UserDataModel = await loginService(formData.usernameOrEmail, formData.password);

      // Update auth context
      login(userData);

      getSuccessAlert(t('auth.loginSuccess'));

      // Redirect to default page for role
      navigate(getDefaultPathForRole(userData.role_name));
    } catch (error: any) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return {
    loading,
    formData,
    errors,
    rememberMe,
    setRememberMe,
    handleChange,
    handleLogin,
    handleKeyPress,
  };
};

export default useMainController;