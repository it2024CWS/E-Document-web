import { ReactNode, createContext } from 'react';
import useFormCreateController from '../controllers/formCreateController';

export type FormCreateControllerType = ReturnType<typeof useFormCreateController>;

export const FormCreateControllerContext = createContext<FormCreateControllerType | null>(null);

export const FormCreateControllerProvider = ({ children }: { children: ReactNode }) => {
  const controller = useFormCreateController();
  return (
    <FormCreateControllerContext.Provider value={controller}>
      {children}
    </FormCreateControllerContext.Provider>
  );
};
