import { JSX } from 'react';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import PermMediaRoundedIcon from '@mui/icons-material/PermMediaRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { colors } from '@/themes/colors';
import { USER_PATH, DOCUMENT_PATH, DEPARTMENT_PATH, DOCTYPE_PATH, DASHBOARD_PATH, ROLE_PATH, DOC_CENTER_PATH } from '@/routes/config';

export const DRAWER_WIDTH: number = 240;
export const APP_BAR_HEIGHT: number = 80;
export const APP_BAR_COLOR: string = colors.dominant.white1;

export interface GroupMenuModel {
  label: string;
  menu: MainMenuItemModel[];
}

export interface MainMenuItemModel {
  label: string;
  path?: string;
  icon?: JSX.Element;
  subMenu?: MainMenuItemModel[];
}

const iconSx = { fontSize: 22 };

export const MAIN_MENU_ITEMS: GroupMenuModel[] = [
  {
    label: 'nav.general',
    menu: [
      {
        label: 'nav.dashboard',
        path: DASHBOARD_PATH,
        icon: <GridViewRoundedIcon sx={iconSx} />,
      },
      {
        label: 'nav.documentManagement',
        icon: <FolderOpenRoundedIcon sx={iconSx} />,
        subMenu: [
          {
            label: 'nav.myFiles',
            path: DOCUMENT_PATH,
            icon: <PermMediaRoundedIcon sx={iconSx} />,
          },
          {
            label: 'nav.documents',
            path: DOC_CENTER_PATH,
            icon: <SwapHorizRoundedIcon sx={iconSx} />,
          },
        ],
      },
    ],
  },
  {
    label: 'nav.dataManagement',
    menu: [
      {
        label: 'nav.userManagement',
        path: USER_PATH,
        icon: <PeopleAltRoundedIcon sx={iconSx} />,
      },
      {
        label: 'nav.roleManagement',
        path: ROLE_PATH,
        icon: <AdminPanelSettingsRoundedIcon sx={iconSx} />,
      },
      {
        label: 'nav.departmentManagement',
        path: DEPARTMENT_PATH,
        icon: <CorporateFareRoundedIcon sx={iconSx} />,
      },
      {
        label: 'nav.documentTypes',
        path: DOCTYPE_PATH,
        icon: <CategoryRoundedIcon sx={iconSx} />,
      },
    ],
  },
];
