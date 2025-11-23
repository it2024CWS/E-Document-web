import Swal from 'sweetalert2';
import { ErrorModel } from '@/models/errorModel';
import './sweetAlert.css';
import { getErrorMessage } from './errorMessage';
import { colors } from '@/themes/colors';

interface ConfirmAlertProps {
  onSubmit?: () => Promise<{ message: string } | void>;
  onCancel?: () => Promise<void>;
  title?: string;
  description?: string;
  successMessage?: string;
  confirmButtonText?: string;
}

const isLanguageExist = localStorage.getItem('Language');
const isEnglish = !isLanguageExist ? true : isLanguageExist === 'en';

const defaultCustomClass = {
  popup: 'swal2-custom-popup',
  confirmButton: 'custom-confirm-button',
};

export const getErrorAlert = async (error: unknown | string, onSubmit?: () => void): Promise<void> => {
  const typedError = error as ErrorModel;
  const result = await Swal.fire({
    ...(typeof typedError !== 'string' && typedError?.response?.status && { title: 'Error' }),
    text: typeof typedError === 'string' ? typedError : getErrorMessage(error),
    icon: 'error',
    confirmButtonText: isEnglish ? 'OK' : 'ຕົກລົງ',
    confirmButtonColor: colors.primary.main,
    customClass: defaultCustomClass,
  });
  if (result.isConfirmed && onSubmit) {
    onSubmit();
  }
};

export const getSuccessAlert = async (message?: string): Promise<void> => {
  Swal.fire({
    title: `<span style="font-size: 22px; color: #1DA243; font-weight: bold; margin-bottom: 64px;">${message ?? 'ສຳເລັດແລ້ວ'}</span>`,
    confirmButtonText: isEnglish ? 'OK' : 'ຕົກລົງ',
    confirmButtonColor: colors.primary.main,
    timer: 1000000,
    // imageUrl: SUCCESS_IC,
    showConfirmButton: false,
    customClass: {
      ...defaultCustomClass,
      title: 'swal2-custom-title',
    },
    showClass: {
      popup: 'swal2-show',
    },
    hideClass: {
      popup: 'swal2-hide swal2-fade',
    },
  });
};

const handleConfirmSubmit = async (onSubmit: () => Promise<{ message: string } | void>, successMessage?: string) => {
  const res = await onSubmit();
  await Swal.fire({
    title: isEnglish ? 'Success' : 'ສຳເລັດ',
    icon: 'success',
    html: res?.message || successMessage ? `${res?.message ?? successMessage}` : null!,
    confirmButtonColor: 'green',
    customClass: defaultCustomClass,
  });
};

export const getConfirmAlert = async ({
  onSubmit,
  onCancel,
  title,
  description,
  successMessage,
  confirmButtonText,
}: ConfirmAlertProps = {}): Promise<void> => {
  const result = await Swal.fire({
    title: title ?? (isEnglish ? 'Are you sure' : 'ທ່ານແນ່ໃຈ ຫຼື ບໍ່'),
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: confirmButtonText ?? (isEnglish ? 'OK' : 'ຕົກລົງ'),
    confirmButtonColor: colors.primary.main,
    cancelButtonColor: '#D3D3D3',
    html: description ? `${description}` : null!,
    cancelButtonText: isEnglish ? 'Cancel' : 'ຍົກເລີກ',
    customClass: {
      ...defaultCustomClass,
      cancelButton: 'custom-cancel-button',
    },
  });

  if (result.isConfirmed && onSubmit) {
    await handleConfirmSubmit(onSubmit, successMessage);
  } else if (onCancel) {
    await onCancel();
  }
};
