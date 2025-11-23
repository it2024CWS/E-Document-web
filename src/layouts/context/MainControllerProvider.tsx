import { ReactNode } from 'react';
import useMainDrawerController from '../controllers';
import { MainControllerContext } from '.';

export type MainControllerType = ReturnType<typeof useMainDrawerController>;

export const MainDrawerControllerProvider = ({ children }: { children: ReactNode }) => {
  const controller = useMainDrawerController();

  return <MainControllerContext.Provider value={controller}>{children}</MainControllerContext.Provider>;
};
