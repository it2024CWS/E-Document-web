import { useState } from 'react';

const useMainDrawerController = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [addDocumentTrigger, setAddDocumentTrigger] = useState<number>(0);

  return {
    open,
    handleChangeOpen: () => setOpen((state) => !state),
    addDocumentTrigger,
    triggerAddDocument: () => setAddDocumentTrigger((prev) => prev + 1),
    consumeAddDocumentTrigger: () => setAddDocumentTrigger(0),
  };
};

export default useMainDrawerController;
