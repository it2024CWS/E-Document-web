import { colors } from '@/themes/colors';
import { JSX } from 'react';
import SvgColor from '@/components/SvgColor';
import { DRAWER_USER_IC, DOCUMENT_COPY_ICON, DRAWER_LINK_APPROVE_IC, DRAWER_LINK_IC, DRAWER_SETTING_IC, DRAWER_REPORT_IC, HOME_IC } from '@/utils/constants/icon';
import { USER_PATH, DOCUMENT_PATH, INCOMING_PATH, OUTGOING_PATH, DEPARTMENT_PATH, DOCTYPE_PATH, DASHBOARD_PATH } from '@/routes/config';

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
    label: 'General',
    menu: [
      {
        label: 'Dashboard',
        path: DASHBOARD_PATH,
        icon: <SvgColor src={HOME_IC} />,
      },
      {
        label: 'User Management',
        path: USER_PATH,
        icon: <SvgColor src={DRAWER_USER_IC} />,
      },
      {
        label: 'Document Management',
        path: DOCUMENT_PATH,
        icon: <SvgColor src={DOCUMENT_COPY_ICON} />,
      },
      {
        label: 'Incoming Documents',
        path: INCOMING_PATH,
        icon: <SvgColor src={DRAWER_LINK_APPROVE_IC} />,
      },
      {
        label: 'Outgoing Documents',
        path: OUTGOING_PATH,
        icon: <SvgColor src={DRAWER_LINK_IC} />,
      },
      {
        label: 'Department Management',
        path: DEPARTMENT_PATH,
        icon: <SvgColor src={DRAWER_SETTING_IC} />,
      },
      {
        label: 'Document Types',
        path: DOCTYPE_PATH,
        icon: <SvgColor src={DRAWER_REPORT_IC} />,
      },
    ],
  },
];
