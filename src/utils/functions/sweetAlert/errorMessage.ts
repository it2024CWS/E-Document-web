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
  // If error is a string, return it directly
  if (typeof error === 'string') return error;

  // If error is an Error instance, check for message first
  if (error instanceof Error && error.message) {
    // Check if it's an axios error with response data
    const err = error as any;
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }
    // Return the error message directly
    return error.message;
  }

  const errorCode = getErrorCode(error);
  console.log('errorCode: ', errorCode);
  const translationKey = `errors.${errorCode}`;
  const translatedMessage = i18next.t(translationKey);
  if (translatedMessage === translationKey) {
    // Try to get message from error object
    const err = error as any;
    if (err?.message) return err.message;
    if (err?.response?.data?.message) return err.response.data.message;
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
