import React, { useCallback, useContext } from 'react';
import { ScreenInterface, ScreenInterfaceWithId } from '../typesInterfaces/screenAndSection';
import { Autocomplete, Button, Chip, styled, TextField, useTheme } from '@mui/material';
import { getDataFilteredByTags, getDifferentTags } from '../utils/tags';
import { DataContext } from '../hooks/dataContext';
import DataItem from './DataItem';
import FlipIcon from '@mui/icons-material/FlipCameraAndroid';
import { getReverseMode } from '../utils/themeStyles';
import cleanDeep from 'clean-deep';
import GraphicsSection from './GraphicsSection';

const LayoutFlex = styled('div')(() => ({
  display: 'flex',
  flex: '1',
}));

const ScreenLayout = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  margin: '5px',
  padding: '5px',
}));

const DataItemsLayout = styled('div')(() => ({
  display: 'flex',
  flex: '1',
  flexWrap: 'wrap',
}));

const RowSection = styled('div')(() => ({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  flexWrap: 'wrap',
  marginTop: '10px',
  position: 'relative',
}));

const TitleLayout = styled('div')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary[getReverseMode(theme)]}`,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  borderBottom: 'none',
  display: 'flex',
  flex: '1',
  flexWrap: 'wrap',
  left: '5px',
  padding: '5px',
  position: 'absolute',
  top: '-4px',
}));

const RowBodySection = styled('div')(({ theme }) => (`
  border: 1px solid ${theme.palette.primary[getReverseMode(theme)]};
  border-radius: 10px;
  border-top-left-radius: 0;
  display: flex;
  flex-direction: row;
  flex: 1;
  margin: 5px;
  padding: 10px;
`));

const ButtonTitleSection = styled(Button)(() => ({
  border: 'none',
  margin: '0 6px',
  padding: 0,
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
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

const getTextAccordingDirection = (flexDirection: 'row' | 'column') => {
  return flexDirection === 'row' ?'Column' : 'Row';
}

interface Props {
  editable: boolean;
  flexDirection?: 'row' | 'column';
  screen: ScreenInterface | ScreenInterfaceWithId;
  setScreen: (screen: ScreenInterface | ScreenInterfaceWithId) => void;
}

const NewScreen = ({ editable, flexDirection = 'row', screen, setScreen }: Props) => {
  const theme = useTheme();
  const { dataStore } = useContext(DataContext);

  const getAutocompleteOptions = useCallback((indexRow: number, indexColumn: number) => {
    const screenTags = screen.rowsColumns[indexRow].rowsColumns[indexColumn].tags;
    return getDifferentTags({dataStore: dataStore || [], tagsAlreadySelected: screenTags });
  }, [dataStore, screen]);

  const addNewSection = (indexRow: number, indexColumn?: number) => {
    const newRow = INITIAL_NEW_SCREEN.rowsColumns[0];
    const newColumn = INITIAL_NEW_SCREEN.rowsColumns[0].rowsColumns[0];

    const nextScreen = JSON.parse(JSON.stringify(screen));
    if (indexColumn === undefined) nextScreen.rowsColumns.splice(indexRow + 1, 0, newRow);
    else nextScreen.rowsColumns[indexRow].rowsColumns.splice(indexColumn + 1, 0, newColumn);

    setScreen(nextScreen);
  }

  const removeNewSection = (indexRow: number, indexColumn?: number) => {
    const nextScreen = JSON.parse(JSON.stringify(screen));
    if (!indexColumn) delete nextScreen.rowsColumns[indexRow];
    else delete nextScreen.rowsColumns[indexRow].rowsColumns[indexColumn];

    const nextScreenCleaned = cleanDeep(nextScreen, { emptyArrays: false }) as ScreenInterface;

    setScreen(nextScreenCleaned);
  }

  const changeDirection = (indexRow: number, indexColumn?: number) => {
    const nextScreen = JSON.parse(JSON.stringify(screen));

    if (indexColumn === undefined) {
      nextScreen.rowsColumns[indexRow].flexDirection =
        nextScreen.rowsColumns[indexRow].flexDirection === 'row' ? 'column' : 'row';
    } else {
      nextScreen.rowsColumns[indexRow].rowsColumns[indexColumn].flexDirection =
        nextScreen.rowsColumns[indexRow].rowsColumns[indexColumn].flexDirection === 'row' ? 'column' : 'row';
    }

    const nextScreenCleaned = cleanDeep(nextScreen, { emptyArrays: false }) as ScreenInterface | ScreenInterfaceWithId;

    setScreen(nextScreenCleaned);
  }

  const updateName = (name: string, indexRowColumn: number, indexRowColumn2?: number) => {
    const nextScreen = JSON.parse(JSON.stringify(screen));

    if (indexRowColumn2 === undefined) nextScreen.rowsColumns[indexRowColumn].name = name;
    else nextScreen.rowsColumns[indexRowColumn].rowsColumns[indexRowColumn2].name = name;
    setScreen(nextScreen);
  }

  return (
    <LayoutFlex sx={{ flexDirection }}>
      {screen.rowsColumns.map(({ rowsColumns, flex, flexDirection: flexDirectionRowColumn, name: nameRowColumn }, indexRow) => {
        const showRowsColumnsTitle = editable || nameRowColumn.length;
        return (
          <RowSection key={`row-${indexRow}`}>
            {showRowsColumnsTitle ?
              (<TitleLayout>
                <TextFieldStyled
                  disabled={!editable}
                  label={`${getTextAccordingDirection(flexDirection)} ${indexRow + 1}`}
                  size="small"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateName(event.target.value, indexRow);
                  }}
                  variant="outlined"
                  value={nameRowColumn}
                />
                {editable && (
                  <>
                    <ButtonTitleSection
                      variant="outlined"
                      onClick={() => addNewSection(indexRow)}
                      size="small"
                    >
                      Add {getTextAccordingDirection(flexDirection)}
                    </ButtonTitleSection>
                    <ButtonTitleSection
                      disabled={screen.rowsColumns.length === 1}
                      onClick={() => removeNewSection(indexRow)}
                      size="small"
                      sx={{ color: theme.palette.error[getReverseMode(theme)]}}
                      variant="outlined"
                    >
                      Remove {getTextAccordingDirection(flexDirection)}
                    </ButtonTitleSection>
                    <FlipIcon onClick={() => changeDirection(indexRow)}/>
                  </>)
                }
              </TitleLayout>) : <></>}
            <RowBodySection className={`${flex}`} sx={{...{flexDirection: flexDirectionRowColumn}, ...showRowsColumnsTitle ? { marginTop: '46px' } : {}}}>
              {rowsColumns.map(({tags, flex: flexColumn, name: nameColumnRow }, indexColumn) => {
                const screenTags = screen.rowsColumns[indexRow].rowsColumns[indexColumn].tags;
                const itemsToShow = getDataFilteredByTags({ dataStore, tags: screenTags });
                const showColumnsRowsTitle = editable || nameColumnRow.length;

                const allTypesAreNumeric = itemsToShow.every((item) => item.type === 'numeric');

                return (
                  <RowSection className={`${flexColumn}`} key={`row-${indexRow}`} sx={showColumnsRowsTitle ? { marginTop: '46px' } : {}} >
                    {showColumnsRowsTitle ? (
                      <TitleLayout>
                        <TextFieldStyled
                          disabled={!editable}
                          label={`${getTextAccordingDirection(flexDirectionRowColumn)} ${indexColumn + 1}`}
                          size="small"
                          variant="outlined"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateName(event.target.value, indexRow, indexColumn);
                          }}
                          value={nameColumnRow}
                        />
                        {editable && (
                          <>
                            <ButtonTitleSection
                              variant="outlined"
                              onClick={() => addNewSection(indexRow, indexColumn)}
                              size="small"
                            >
                              Add {getTextAccordingDirection(flexDirectionRowColumn)}
                            </ButtonTitleSection>
                            <ButtonTitleSection
                              onClick={() => removeNewSection(indexRow, indexColumn)}
                              size="small"
                              sx={{ color: theme.palette.error[getReverseMode(theme)]}}
                              variant="outlined"
                              disabled={screen.rowsColumns[indexRow].rowsColumns.length === 1}
                            >
                              Remove {getTextAccordingDirection(flexDirectionRowColumn)}
                            </ButtonTitleSection>
                          </>
                        )}
                      </TitleLayout>
                    ) : <></>}
                    <RowBodySection key={`column-${indexColumn}`} sx={{ flexDirection: 'column', ...showRowsColumnsTitle ? { marginTop: '46px' } : {} }}>
                      <Autocomplete
                        multiple
                        id="tags-filled"
                        options={getAutocompleteOptions(indexRow, indexColumn)}
                        value={tags}
                        freeSolo
                        onChange={(event, newTags: string[]) => {
                          const nextScreen = JSON.parse(JSON.stringify(screen));
                          nextScreen.rowsColumns[indexRow].rowsColumns[indexColumn].tags = newTags;
                          setScreen(nextScreen);
                        }}
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => (
                            <Chip {...getTagProps({ index })} key={`newScreen-tag-chip-${index}`} variant="outlined" label={option} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextFieldStyled
                            {...params}
                            variant="filled"
                            label="Section tags"
                            placeholder="Favorites"
                          />
                        )}
                      />
                      <ScreenLayout>
                        {allTypesAreNumeric && (
                          <GraphicsSection tagsSection={tags} dataSection={itemsToShow} />
                        )}
                        <DataItemsLayout theme={theme}>
                          {itemsToShow.map((item) => (
                            <DataItem key={`newScreen-dataItem-${item.id}`} data={item} />
                          ))}
                        </DataItemsLayout>
                      </ScreenLayout>
                    </RowBodySection>
                  </RowSection>
                )
              })}
            </RowBodySection>
          </RowSection>
        );
      })}
    </LayoutFlex>
  );
}

export default NewScreen;
