import { Box, ButtonBase, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from '@/themes/colors';

const LANGUAGES = [
  { code: 'lo', label: 'ລາວ', flagCode: 'la' },
  { code: 'en', label: 'English', flagCode: 'gb' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '999px',
        border: `1px solid ${colors.secondary.gray1}`,
        overflow: 'hidden',
        bgcolor: colors.dominant.white1,
      }}
    >
      {LANGUAGES.map((lang, idx) => {
        const isActive = current === lang.code;
        return (
          <ButtonBase
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            sx={{
              px: 1.5,
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              bgcolor: isActive ? colors.primary.main : 'transparent',
              borderRight: idx === 0 ? `1px solid ${colors.secondary.gray1}` : 'none',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: isActive ? colors.primary.main : `${colors.primary.main}12`,
              },
            }}
          >
            <span
              className={`fi fi-${lang.flagCode}`}
              style={{ width: 18, height: 14, borderRadius: 2, flexShrink: 0 }}
            />
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: isActive ? '#fff' : colors.secondary.text,
                lineHeight: 1,
              }}
            >
              {lang.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default LanguageSwitcher;
