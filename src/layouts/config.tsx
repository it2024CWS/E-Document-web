import { colors } from '@/themes/colors';
import { JSX } from 'react';
import SvgColor from '@/components/SvgColor';
import { DRAWER_USER_IC } from '@/utils/constants/icon';
import { USER_PATH } from '@/routes/config';
  
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
        label: 'User Management',
        path: USER_PATH,
        icon: <SvgColor src={DRAWER_USER_IC} />,
      },
    ],
  },
];
