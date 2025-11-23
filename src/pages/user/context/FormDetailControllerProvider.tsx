import { ReactNode, createContext, useContext } from 'react';
import useFormDetailController from '../controllers/formDetailController';

export type FormDetailControllerType = ReturnType<typeof useFormDetailController>;

export const FormDetailControllerContext = createContext<FormDetailControllerType | null>(null);

export const useFormDetailControllerContext = () => {
  const context = useContext(FormDetailControllerContext);
  if (!context) {
    throw new Error('useFormDetailControllerContext must be used within FormDetailControllerProvider');
  }
  return context;
};

export const FormDetailControllerProvider = ({ children }: { children: ReactNode }) => {
  const controller = useFormDetailController();

  return <FormDetailControllerContext.Provider value={controller}>{children}</FormDetailControllerContext.Provider>;
};
