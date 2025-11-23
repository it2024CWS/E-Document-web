import { colors } from '@/themes/colors';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

interface TabItem {
  label: string;
  value: string;
}

interface TabZoneProps {
  tabs: TabItem[];
  onTabChange?: (value: string) => void;
  defaultTab?: string;
}

const TabComponent = ({ tabs, onTabChange, defaultTab }: TabZoneProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.value || '');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderRadius: '12px 12px 0 0',
          bgcolor: '#fff',
          '& .MuiTabs-indicator': {
            backgroundColor: `${colors.primary.main}`,
            height: 3,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            color: '#666',
            minHeight: '48px',
            '&.Mui-selected': {
              color: `${colors.primary.main}`,
              fontWeight: 600,
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabComponent;
