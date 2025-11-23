import { colors } from '@/themes/colors';
import { radius } from '@/themes/radius';
import { formatDate } from '@/utils/functions/formatDate';
import { formatTime } from '@/utils/functions/formatTime';
import { Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const SectionCurrentTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = formatDate(date); // DD/MM/YYYY
  const formattedTime = formatTime(date);

  return (
    <Stack direction="row" sx={{ borderRadius: radius[5], bgcolor: colors.dominant.white3, height: '48px', px: '24px', alignItems: 'center' }}>
      <Typography variant='body2'>{`${formattedDate} - ${formattedTime}`}</Typography>
    </Stack>
  );
};

export default SectionCurrentTime;
