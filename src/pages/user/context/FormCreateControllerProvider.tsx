import { ReactNode, createContext, useContext } from 'react';
import useFormCreateController from '../controllers/formCreateController';

export type FormCreateControllerType = ReturnType<typeof useFormCreateController>;

export const FormCreateControllerContext = createContext<FormCreateControllerType | null>(null);

export const useFormCreateControllerContext = () => {
  const context = useContext(FormCreateControllerContext);
  if (!context) {
    throw new Error('useFormCreateControllerContext must be used within FormCreateControllerProvider');
  }
  return context;
};

export const FormCreateControllerProvider = ({ children }: { children: ReactNode }) => {
  const controller = useFormCreateController();

  return <FormCreateControllerContext.Provider value={controller}>{children}</FormCreateControllerContext.Provider>;
};
