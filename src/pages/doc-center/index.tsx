import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SendIcon from '@mui/icons-material/Send';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import InboundTab from './components/InboundTab';
import OutboundTab from './components/OutboundTab';
import AddDocumentModal from './components/AddDocumentModal';
import AddIcon from '@mui/icons-material/Add';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ mt: 2 }}>
    {value === index && children}
  </Box>
);

const DocCenterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync tab with URL search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'outbound') {
      setTab(1);
    } else {
      setTab(0);
    }
  }, [searchParams]);

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    setSearchParams({ tab: newValue === 1 ? 'outbound' : 'inbound' });
  };

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          { label: 'Document Management' },
          { label: tab === 0 ? 'Inbound Documents' : 'Outbound Documents' },
        ]}
      />

      <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {tab === 0 ? 'Inbound Documents' : 'Outbound Documents'}
        </Typography>
        {tab === 1 && (
          <Button
            id="btn-add-docs"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 12px rgba(5, 43, 170, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(5, 43, 170, 0.3)',
              }
            }}
          >
            Add Docs
          </Button>
        )}
      </Box>

      {/* Tab Bar */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'white',
          borderRadius: '8px 8px 0 0',
          px: 2,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '14px',
              minHeight: 48,
              textTransform: 'none',
              gap: 1,
            },
          }}
        >
          <Tab
            id="tab-inbound"
            icon={<InboxIcon fontSize="small" />}
            iconPosition="start"
            label="Inbound Documents"
          />
          <Tab
            id="tab-outbound"
            icon={<SendIcon fontSize="small" />}
            iconPosition="start"
            label="Outbound Documents"
          />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <InboundTab />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <OutboundTab />
      </TabPanel>

      <AddDocumentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
            // Logic to refresh data if needed
            console.log('Document added successfully');
        }}
      />
    </Box>
  );
};

export default DocCenterPage;
