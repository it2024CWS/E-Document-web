import { useState, useEffect, useRef } from 'react';
import { Box, Tabs, Tab, Typography, Button, TextField } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SendIcon from '@mui/icons-material/Send';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import InboundTab, { InboundTabRef } from './components/InboundTab';
import OutboundTab from './components/OutboundTab';
import AddDocumentModal from './components/AddDocumentModal';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const outboundTabRef = useRef<any>(null);
  const inboundTabRef = useRef<InboundTabRef>(null);

  const [docNo, setDocNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  const clearFilters = () => {
    setDocNo('');
    setStartDate('');
    setEndDate('');
    setStatus('');
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    setTab(tabParam === 'outbound' ? 1 : 0);
  }, [searchParams]);

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    setSearchParams({ tab: newValue === 1 ? 'outbound' : 'inbound' });
  };

  const tabBarSlot = (
    <Box
      sx={{
        bgcolor: 'white',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        px: 2,
        mb: 0,
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
            minHeight: 44,
            textTransform: 'none',
            gap: 1,
          },
        }}
      >
        <Tab id="tab-inbound" icon={<InboxIcon fontSize="small" />} iconPosition="start" label={t('docs.inbound')} />
        <Tab id="tab-outbound" icon={<SendIcon fontSize="small" />} iconPosition="start" label={t('docs.outbound')} />
      </Tabs>
    </Box>
  );

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          { label: t('nav.documentManagement') },
          { label: tab === 0 ? t('docs.inbound') : t('docs.outbound') },
        ]}
      />

      <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {tab === 0 ? t('docs.inbound') : t('docs.outbound')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="success"
            onClick={() => tab === 0 ? inboundTabRef.current?.triggerExport() : outboundTabRef.current?.triggerExport()}
          >
            {t('common.exportExcel')}
          </Button>
          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={() => tab === 0 ? inboundTabRef.current?.refresh() : outboundTabRef.current?.refresh()}
          >
            {t('common.refresh')}
          </Button>
          {tab === 1 && (
            <Button
              id="btn-add-docs"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
            >
              {t('common.addDocs')}
            </Button>
          )}
        </Box>
      </Box>

      {tab === 1 && (
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            mb: 0,
          }}
        >
          <TextField
            size="small"
            label={t('docs.docNo')}
            value={docNo}
            onChange={(e) => setDocNo(e.target.value)}
            placeholder={t('docs.filterByDocNo')}
            sx={{ width: 160 }}
          />
          <TextField
            size="small"
            type="date"
            label={t('docs.startDate')}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            type="date"
            label={t('docs.endDate')}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 150 }}
          />
          <TextField
            select
            size="small"
            label={t('docs.filterByStatus')}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            slotProps={{ inputLabel: { shrink: true }, select: { native: true } }}
            sx={{ width: 150 }}
          >
            <option value="">{t('docs.allStatuses')}</option>
            <option value="pending">{t('common.pending')}</option>
            <option value="approved">{t('common.approved')}</option>
            <option value="rejected">{t('common.rejected')}</option>
          </TextField>
          <Button variant="outlined" size="small" onClick={clearFilters}>
            {t('common.clear')}
          </Button>
        </Box>
      )}

      <TabPanel value={tab} index={0}>
        <InboundTab ref={inboundTabRef} tabBar={tabBarSlot} />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <OutboundTab
          ref={outboundTabRef}
          docNo={docNo}
          startDate={startDate}
          endDate={endDate}
          status={status}
          tabBar={tabBarSlot}
        />
      </TabPanel>

      <AddDocumentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await new Promise(r => setTimeout(r, 1500));
          outboundTabRef.current?.refresh();
        }}
      />
    </Box>
  );
};

export default DocCenterPage;
