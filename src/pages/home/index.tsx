import useMainControllerContext from './context';
import { MainControllerProvider } from './context/MainControllerProvider';
import { FormEnum } from '@/enums/formEnum';
import FormDetail from './page/FormDetail';
import FormCreate from './page/FormCreate';
import { FormDetailControllerProvider } from './context/FormDetailControllerProvider';
import { FormCreateControllerProvider } from './context/FormCreateControllerProvider';
import { Box } from '@mui/material';
import { colors } from '../../themes/colors';

const Content = () => {
  const ctrl = useMainControllerContext();

  switch (ctrl.currentForm) {
    case FormEnum.DETAIL:
      return (
        <FormDetailControllerProvider>
          <FormDetail />
        </FormDetailControllerProvider>
      );
    case FormEnum.CREATE:
      return (
        <FormCreateControllerProvider>
          <FormCreate />
        </FormCreateControllerProvider>
      );

    default:
      return (
       <Box sx={{ bgcolor: colors.accent.main, p: 4, borderRadius: 2 }}>
         Welcome to E-Document Management System
       </Box>
      );
  }
};

const HomePage = () => {
  return (
    <MainControllerProvider>
      <Content />
    </MainControllerProvider>
  );
};

export default HomePage;
