import { useContext } from 'react';
import { FormCreateControllerContext } from './FormCreateControllerProvider';

const useFormCreateControllerContext = () => {
  const context = useContext(FormCreateControllerContext);
  if (!context) {
    throw new Error('useFormCreateControllerContext must be used within FormCreateControllerProvider');
  }
  return context;
};

export default useFormCreateControllerContext;
