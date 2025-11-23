import { colors } from '@/themes/colors';
import { GroupMenuModel, MainMenuItemModel } from '../config';
import { Box, ListItem, ListItemIcon, ListItemButton, List, Collapse, Typography } from '@mui/material';
import React, { useState } from 'react';
import { radius } from '@/themes/radius';
import { useNavigate } from 'react-router-dom';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandMore from '@mui/icons-material/ExpandMore';
import useMainDrawerControllerContext from '../context';

interface ListMenuItemProps {
  menu: GroupMenuModel;
  currentPath: string;
}

const isMenuItemActive = (item: MainMenuItemModel, currentPath: string): boolean => {
  if (item.path) {
    if (item.path === '/') return currentPath === '/';
    return currentPath.startsWith(item.path);
  }
  if (item.subMenu) {
    return item.subMenu.some((sub) => isMenuItemActive(sub, currentPath));
  }
  return false;
};

const NestedMenuItem: React.FC<{ item: MainMenuItemModel; currentPath: string; level?: number }> = ({ item, currentPath, level = 0 }) => {
  const navigate = useNavigate();
  const { open } = useMainDrawerControllerContext();
  const [collapseOpen, setCollapseOpen] = useState(false);
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;
  const isActive = isMenuItemActive(item, currentPath);

  const handleClick = (path?: string) => {
    if (hasSubMenu) setCollapseOpen((prev) => !prev);
    if (path && !hasSubMenu) navigate(path);
  };

  return (
    <>
      <ListItem disablePadding sx={{ px: open ? '16px' : '4px', py: '4px' }}>
        <ListItemButton
          onClick={() => handleClick(item?.path)}
          sx={{
            px: 2,
            py: 2,
            pl: open ? 2 + level * 2 : 0,
            background: isActive ? `${colors.primary.main}20` : 'none',
            color: isActive ? colors.primary.main : 'inherit',
            '&:hover': {
              background: `${colors.primary.main}40`,
            },
            fontWeight: isActive ? 700 : 500,
            borderRadius: radius[2],
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            {item.icon && (
              <ListItemIcon
                sx={{
                  width: open ? 24 : '100%',
                  height: 24,
                  color: isActive ? colors.primary.main : 'inherit',
                  minWidth: 0,
                  mr: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <Typography sx={{ fontWeight: 'inherit', fontSize: '14px', textWrap: 'wrap', overflow: 'hidden' }}>
              {!hasSubMenu && level !== 0 && <CircleIcon sx={{ fontSize: 'calc(1em - 6px)', mr: 1, width: !open ? '30px' : 'auto' }} />}
              {open && item.label}
            </Typography>
          </Box>
          {hasSubMenu && open && (collapseOpen ? <KeyboardArrowRightIcon /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {hasSubMenu && (
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenu!.map((sub, idx) => (
              <NestedMenuItem key={sub.label + idx} item={sub} currentPath={currentPath} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const ListMenuItem: React.FC<ListMenuItemProps> = ({ menu, currentPath }) => {
  const { open } = useMainDrawerControllerContext();
  return (
    <>
      {open && (
        <Box sx={{ pl: 2, pt: 1, pb: 0.5 }}>
          <Typography sx={{ fontSize: '14px', color: colors.secondary.gray2, fontWeight: 'bold' }}>{menu.label}</Typography>
        </Box>
      )}
      <List>
        {menu.menu.map((item, idx) => (
          <NestedMenuItem key={item.label + idx} item={item} currentPath={currentPath} level={0} />
        ))}
      </List>
    </>
  );
};

export default ListMenuItem;
