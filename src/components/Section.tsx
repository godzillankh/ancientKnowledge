import React, { useContext } from 'react';
import { styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataContext } from '../hooks/dataContext';
import DataItem from './DataItem';
import { getDataFilteredByTags } from '../utils/tags';

const Layout = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

interface Props {
  tags: string[];
}

const Section = ({ tags }: Props) => {
  const theme = useTheme();
  const { dataStore } = useContext(DataContext);

  const itemsToShow = getDataFilteredByTags({ dataStore, tags });

  return (
    <Layout theme={theme}>
      {itemsToShow.map((item) => (
        <DataItem key={`section-dataItem-${item.id}`} data={item} />
      ))}
    </Layout>);
}

export default Section;
