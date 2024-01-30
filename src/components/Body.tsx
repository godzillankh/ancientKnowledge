import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DataItem from './DataItem';
import { dataItemApiService } from '../api/dataItemApi';
import { DataContext } from '../hooks/dataContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getReverseMode } from '../utils/themeStyles';
import NewScreen from './NewScreen';
import FlipIcon from '@mui/icons-material/FlipCameraAndroid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ScreenInterface, ScreenInterfaceWithId } from '../typesInterfaces/screenAndSection';
import { screensService } from '../api/screensApi';
import { ScreensContext } from '../hooks/screensContext';
import { DataItemInterface } from '../typesInterfaces/dataItem';

const Layout = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

const DataItemsLayout = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'inline',
  flex: '1',
  flexWrap: 'wrap',
  padding: '5px',
}));

const AccordeonLayout = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary[getReverseMode(theme)]}`,
  borderRadius: '10px !important;',
  boxShadow: 'unset',
  display: 'flex',
  flexDirection: 'column',
}));

const AccordionDetailsLayout = styled(AccordionDetails)(({ theme }) => (`
  border: 1px solid ${theme.palette.primary[getReverseMode(theme)]};
  border-radius: 7px;
  flex: 1;
  margin: 15px;
  padding: 15px;
`));

const TabBarStyled = styled('div')(({ theme }) => (`
  background-color: ${theme.palette.background.paper};
  border: 1px solid ${theme.palette.primary[getReverseMode(theme)]};
  padding: 5px;
  display: flex;
  align-items: center;
`));

const CreateScreenBtn = styled(Button)(({ theme }) => (`
  background-color: ${theme.palette.background.paper};
  border: 1px solid ${theme.palette.primary[getReverseMode(theme)]};
  border-radius: 10px;
  box-shadow: unset;
  color: ${theme.palette.primary[getReverseMode(theme)]};
  flex: 1;
  margin-left: 10px;
  padding: 11px 16px;
  
  &:hover {
    color: white !important;
  }
`));

const ButtonNewScreen = styled(Button)(() => ({
  border: 'none',
  margin: '0 6px',
  padding: 0,
}));

const INITIAL_NEW_SCREEN: ScreenInterface = {
  name: '',
  flexDirection: 'row',
  rowsColumns: [
    {
      flex: 1,
      flexDirection: 'column',
      name: '',
      rowsColumns: [
        {
          flex: 1,
          name: '',
          tags: []
        }
      ]
    }
  ]
};

const Body = () => {
  const theme = useTheme();
  const [screenDirection, setScreenDirection] = useState<'row' | 'column'>('row');
  const [activateEditableScreen, setActivateEditableScreen] = useState<boolean>(false);
  const [screen, setScreen] = useState<ScreenInterface | ScreenInterfaceWithId | undefined>(undefined);
  const { addDataItem } = dataItemApiService();

  const navigate = useNavigate();

  const screenEdition = screen && 'id' in screen;

  const { getDataItems } = dataItemApiService();
  const { addScreen, removeScreen, updateScreen } = screensService();
  const { dataStore } = useContext(DataContext);
  const { screensStore } = useContext(ScreensContext);

  useEffect(() => {
    const getData = async () => {
     await getDataItems();
    };
    getData();
  }, []);

  const saveUpdateScreen = async () => {
    if (!screen) return;
    let response;
    if (screenEdition) response = await updateScreen(screen);
    else {
      response = await addScreen(screen as ScreenInterfaceWithId);
    }
    if (response) {
      setScreen(undefined);
    }
  }

  const deleteScreen = async () => {
    if (!screen || !('id' in screen)) return;
    const response = await removeScreen(screen.id);
    if (response) setScreen(undefined);
  }

  return (
    <Layout theme={theme}>
      <TabBarStyled>
        <TextField
          label="Create multiple data at the same time"
          size="small"
          variant="outlined"
          onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
            const listData: DataItemInterface[] = JSON.parse(event.target.value);
            listData.forEach(async (item) => {
              addDataItem(item);
            });
          }}
        />
        <AccordeonLayout theme={theme}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="dataItem-accordion"
          >
            <Typography>Add new data</Typography>
          </AccordionSummary>
          <AccordionDetailsLayout>
            <DataItem />
          </AccordionDetailsLayout>
        </AccordeonLayout>
        {screen !== undefined ? (
          <TabBarStyled>
            <TextField
              disabled={!activateEditableScreen}
              label="Screen name"
              size="small"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setScreen({ ...screen, name: event.target.value });
              }}
              value={screen.name}
            />
            <FlipIcon onClick={() => setScreenDirection(screenDirection === 'row' ? 'column' : 'row')} />
            {
              activateEditableScreen ? (
                <ButtonNewScreen onClick={saveUpdateScreen}>
                  {screenEdition ? 'Update' : 'Save'} screen
                </ButtonNewScreen>
              ) : (
                <ButtonNewScreen onClick={() => setActivateEditableScreen(true)}>
                  Edit Screen
                </ButtonNewScreen>
              )
            }
            {screenEdition && (
              <ButtonNewScreen onClick={deleteScreen} color="error">
                Remove screen
              </ButtonNewScreen>
            )}
            <IconButton aria-label="delete" size="small" onClick={() => {
              navigate('', { replace: true });
              setScreen(undefined);
            }} color="error">
              <HighlightOffIcon fontSize="inherit" />
            </IconButton>
          </TabBarStyled>
        ) : (
          <TabBarStyled sx={{ border: 'unset' }}>
            {(screensStore || []).map((screenItem) => (
              <ButtonNewScreen
                key={`screen-${screenItem.id}`}
                onClick={() => {
                  navigate(`?screen=${screenItem.name}`, { replace: true });
                  setScreen(screenItem)
                }}
              >
                {screenItem.name}
              </ButtonNewScreen>
            ))}
            <CreateScreenBtn
              endIcon={<AddCircleOutlineIcon />}
              onClick={() => setScreen(INITIAL_NEW_SCREEN)}
              variant="contained"
            >
              Create screen to sort the data
            </CreateScreenBtn>
          </TabBarStyled>
        )}
      </TabBarStyled>
      {screen !== undefined ? (
        <NewScreen
          editable={activateEditableScreen}
          flexDirection={screenDirection}
          screen={screen}
          setScreen={setScreen}
        />
      ) : (
        <DataItemsLayout theme={theme}>
          {dataStore && dataStore.map((item) => (
            <DataItem key={`body-dataItem-${item.id}`} data={item} />
          ))}
        </DataItemsLayout>
      )}
    </Layout>);
}

export default Body;
