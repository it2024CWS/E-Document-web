import { ErrorModel } from '@/models/errorModel';
import i18next from 'i18next';

const getErrorCode = (error: unknown): string => {
  console.log(error);
  if (!error) return 'UNKNOWN_ERROR';

  const isObject = typeof error === 'object';
  if (!isObject) return 'UNKNOWN_ERROR';
  const err = error as ErrorModel;
  if (err.response?.data?.error?.code) return err.response?.data?.error?.code;
  if (error instanceof Error) {
    const match = error.name.match(/^([A-Z_]+)$/);
    if (match) return match[1];
  }
  return 'UNKNOWN_ERROR';
};

export const getErrorMessage = (error: unknown): string => {
  const errorCode = getErrorCode(error);
  console.log('errorCode: ', errorCode);
  const translationKey = `errors.${errorCode}`;
  const translatedMessage = i18next.t(translationKey);
  if (translatedMessage === translationKey) {
    if (typeof error === 'string') return error;
    return i18next.t('errors.UNKNOWN_ERROR');
  }
  return translatedMessage;
};

export const getErrorMessageWithFallback = (error: unknown, fallbackMessage: string): string => {
  const errorCode = getErrorCode(error);
  const translationKey = `errors.${errorCode}`;
  const translatedMessage = i18next.t(translationKey);
  if (translatedMessage === translationKey) {
    if (typeof error === 'string') return error;
    return fallbackMessage;
  }

  return translatedMessage;
};
