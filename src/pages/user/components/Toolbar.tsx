import { radius } from '@/themes/radius';
import { Box, BoxProps, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextFieldSearch from '@/components/TextField/TextFieldSearch';
import { FormEnum } from '@/enums/formEnum';
import { useState, useEffect, memo, useRef } from 'react';

interface ToolbarProps extends BoxProps {
  onChangeForm: (form: FormEnum) => void;
  onSearch: (query: string) => void;
  initialSearchQuery?: string;
}

const Toolbar = memo(
  ({ onChangeForm, onSearch, initialSearchQuery, ...props }: ToolbarProps) => {
    const [localSearchValue, setLocalSearchValue] = useState(initialSearchQuery || '');
    const isFirstRender = useRef(true);
    const onSearchRef = useRef(onSearch);
    const onChangeFormRef = useRef(onChangeForm);

    // Keep the refs updated with latest callbacks
    useEffect(() => {
      onSearchRef.current = onSearch;
      onChangeFormRef.current = onChangeForm;
    }, [onSearch, onChangeForm]);

    // Debounce search - update only after user stops typing for 500ms
    useEffect(() => {
      // Skip the first render to prevent initial search trigger
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      const timer = setTimeout(() => {
        onSearchRef.current(localSearchValue);
      }, 500);

      return () => clearTimeout(timer);
    }, [localSearchValue]);

  return (
    <Box {...props} sx={{ p: 2, bgcolor: 'white', borderRadius: radius[2], ...props?.sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextFieldSearch
            placeholder="Search users..."
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
          />
        </Box>

        <Button onClick={() => onChangeFormRef.current(FormEnum.CREATE)}>
          <AddIcon sx={{ fontSize: 20, mr: 1 }} />
          Create User
        </Button>
      </Box>
    </Box>
  );
  },
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if initialSearchQuery changes
    // Ignore changes to callback props (onChangeForm, onSearch) to prevent unnecessary re-renders
    return prevProps.initialSearchQuery === nextProps.initialSearchQuery;
  }
);

Toolbar.displayName = 'Toolbar';

export default Toolbar;
