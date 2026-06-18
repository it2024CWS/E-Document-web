import { ErrorModel } from '@/models/errorModel';
import i18next from 'i18next';

const getErrorCode = (error: unknown): string => {
  if (!error) return 'UNKNOWN_ERROR';
  if (typeof error !== 'object') return 'UNKNOWN_ERROR';
  const err = error as ErrorModel;
  if (err.response?.data?.error_code) return err.response.data.error_code;
  if (error instanceof Error) {
    const match = error.name.match(/^([A-Z_]+)$/);
    if (match) return match[1];
  }
  return 'UNKNOWN_ERROR';
};

const translateCode = (code: string): string | null => {
  const key = `errors.${code}`;
  const translated = i18next.t(key);
  return translated !== key ? translated : null;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  if (error instanceof Error || (typeof error === 'object' && error !== null)) {
    const err = error as any;

    // Prioritise error_code translation — gives localised message in both languages
    const code = err?.response?.data?.error_code;
    if (code) {
      const translated = translateCode(code);
      if (translated) return translated;
    }

    // Fall back to BE message field
    if (err?.response?.data?.message) return err.response.data.message;

    // Plain Error message (e.g. thrown manually in controller)
    if (error instanceof Error && error.message) return error.message;
  }

  const errorCode = getErrorCode(error);
  return translateCode(errorCode) ?? i18next.t('errors.UNKNOWN_ERROR');
};

export const getErrorMessageWithFallback = (error: unknown, fallbackMessage: string): string => {
  const errorCode = getErrorCode(error);
  return translateCode(errorCode) ?? fallbackMessage;
};
