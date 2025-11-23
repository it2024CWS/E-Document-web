import { colors } from '@/themes/colors';
import { ARROW_RIGHT_IC, HOME_IC } from '@/utils/constants/icon';
import { Box, Breadcrumbs, BreadcrumbsProps, Typography } from '@mui/material';

interface Props extends BreadcrumbsProps {
  breadcrumbs: { label: string; onClick?: () => void }[];
  showHome?: boolean;
}
const BreadcrumbsCustom = ({ breadcrumbs, showHome = true, ...props }: Props) => {
  const lastBreadcrumb = <Typography sx={{ color: colors.secondary.text, fontWeight: 700 }}>{breadcrumbs[breadcrumbs.length - 1].label}</Typography>;
  const styledBreadcrumbs = breadcrumbs.slice(0, -1).map((item, index) => (
    <Typography
      key={index}
      onClick={() => item.onClick?.()}
      sx={{
        color: '#BBBBBB',
        '&:hover': {
          textDecoration: item.onClick ? 'underline' : 'none',
          cursor: item.onClick ? 'pointer' : 'default',
        },
      }}
    >
      {item.label}
    </Typography>
  ));

  return (
    <Breadcrumbs
      {...props}
      separator={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mx: '2px' }}>
          <img src={ARROW_RIGHT_IC} alt="arrow" />
        </Box>
      }
      aria-label="breadcrumb"
    >
      {showHome && <img src={HOME_IC} style={{ height: '20px', verticalAlign: 'middle' }} alt="home" />}
      {styledBreadcrumbs}
      {lastBreadcrumb}
    </Breadcrumbs>
  );
};

export default BreadcrumbsCustom;
