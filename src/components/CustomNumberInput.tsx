import React from 'react';
import { Unstable_NumberInput as BaseNumberInput, NumberInputProps } from '@mui/base/Unstable_NumberInput';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material';
import { getReverseMode } from '../utils/themeStyles';

const CustomNumberInput = (props: NumberInputProps) => {

  const StyledInputRoot = styled('div')(
    ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  color: ${theme.palette.primary[getReverseMode(theme)]};
  display: flex;
  margin: 15px 0;
`,
  );

  const StyledInput = styled('input')(
    ({ theme }) => `
  flex: 1;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: ${theme.palette.primary[getReverseMode(theme)]};
  background: ${theme.palette.background.paper};
  border: 1px solid ${theme.palette.primary[getReverseMode(theme)]};
  border-radius: 8px;
  margin: 0 8px;
  padding: 10px 12px;
  outline: 0;
  min-width: 0;
  text-align: center;
`,
  );

  const StyledButton = styled('button')(
    ({ theme }) => `
  align-items: center;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px solid;
  border-radius: 999px;
  border-color: ${theme.palette.primary[getReverseMode(theme)]};
  background: ${theme.palette.background.paper};
  color: ${theme.palette.primary[getReverseMode(theme)]};
  width: 32px;
  height: 32px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: ${theme.palette.background.paper};
    border-color: ${theme.palette.primary[getReverseMode(theme)]};
    color: ${theme.palette.primary[getReverseMode(theme)]};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`,
  );

  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInput,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: <AddIcon fontSize="small" />,
          className: 'increment',
        },
        decrementButton: {
          children: <RemoveIcon fontSize="small" />,
        },
      }}
      {...props}
    />
  );
}

export default CustomNumberInput;
