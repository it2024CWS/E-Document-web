import { ReactNode, createContext } from 'react';
import useFormDetailController from '../controllers/formDetailController';

export type FormDetailControllerType = ReturnType<typeof useFormDetailController>;

export const FormDetailControllerContext = createContext<FormDetailControllerType | null>(null);

export const FormDetailControllerProvider = ({ children }: { children: ReactNode }) => {
  const controller = useFormDetailController();
  return (
    <FormDetailControllerContext.Provider value={controller}>
      {children}
    </FormDetailControllerContext.Provider>
  );
};
