import type { Theme } from '@mui/material/styles';

type GetReverseModeInterface = (theme: Theme) => 'light' | 'dark';

export const getReverseMode: GetReverseModeInterface = (theme: Theme) => theme.palette.mode === 'light' ? 'dark' : 'light';
