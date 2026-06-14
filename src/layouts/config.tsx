import { colors } from '@/themes/colors';
import { JSX } from 'react';
import SvgColor from '@/components/SvgColor';
import { DRAWER_USER_IC, DOCUMENT_COPY_ICON, DRAWER_LINK_APPROVE_IC, DRAWER_SETTING_IC, DRAWER_REPORT_IC, HOME_IC } from '@/utils/constants/icon';
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

export const MAIN_MENU_ITEMS: GroupMenuModel[] = [
  {
    label: 'nav.general',
    menu: [
      {
        label: 'nav.dashboard',
        path: DASHBOARD_PATH,
        icon: <SvgColor src={HOME_IC} />,
      },
      {
        label: 'nav.documentManagement',
        icon: <SvgColor src={DOCUMENT_COPY_ICON} />,
        subMenu: [
          {
            label: 'nav.myFiles',
            path: DOCUMENT_PATH,
            icon: <SvgColor src={DOCUMENT_COPY_ICON} />,
          },
          {
            label: 'nav.documents',
            path: DOC_CENTER_PATH,
            icon: <SvgColor src={DRAWER_LINK_APPROVE_IC} />,
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
        icon: <SvgColor src={DRAWER_USER_IC} />,
      },
      {
        label: 'nav.roleManagement',
        path: ROLE_PATH,
        icon: <SvgColor src={DRAWER_USER_IC} />,
      },
      {
        label: 'nav.departmentManagement',
        path: DEPARTMENT_PATH,
        icon: <SvgColor src={DRAWER_SETTING_IC} />,
      },
      {
        label: 'nav.documentTypes',
        path: DOCTYPE_PATH,
        icon: <SvgColor src={DRAWER_REPORT_IC} />,
      },
    ],
  },
];
