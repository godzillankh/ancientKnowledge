import React from 'react';
import { styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LabelStyled = styled('span')(() => (`
  font-size: 16px;
  margin-right: 15px;
`));

interface Props {
  children: React.ReactNode,
}

const Label = ({ children }: Props) => {

  const theme = useTheme();

  return (
    <LabelStyled theme={theme}>
      {children}
    </LabelStyled>);
}

export default Label;
