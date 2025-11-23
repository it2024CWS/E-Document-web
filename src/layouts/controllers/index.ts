import { useState } from 'react';

const useMainDrawerController = () => {
  const [open, setOpen] = useState<boolean>(true);

  return {
    open,
    handleChangeOpen: () => setOpen((state) => !state),
  };
};

export default useMainDrawerController;
