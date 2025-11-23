import { useContext } from 'react';
import { FormDetailControllerContext } from './FormDetailControllerProvider';

const useFormDetailControllerContext = () => {
  const context = useContext(FormDetailControllerContext);
  if (!context) {
    throw new Error('useFormDetailControllerContext must be used within FormDetailControllerProvider');
  }
  return context;
};

export default useFormDetailControllerContext;
