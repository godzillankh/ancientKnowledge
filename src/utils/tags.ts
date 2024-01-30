import { DataItemInterfaceWithId } from '../typesInterfaces/dataItem';

interface GetDifferentTagsProps {
  dataStore: DataItemInterfaceWithId[];
  tagsAlreadySelected?: string[];
}

export const getDifferentTags = ({ dataStore, tagsAlreadySelected }: GetDifferentTagsProps) => {
  const tagsOptions: string[] = [];

  dataStore.forEach((item: DataItemInterfaceWithId) => {
    item.tags.forEach((tag) => {
      if (!tagsOptions.includes(tag) && (!tagsAlreadySelected || !tagsAlreadySelected.includes(tag))) tagsOptions.push(tag);
    });
  });
  return tagsOptions;
}

interface GetDataFilteredByTagsProps {
  dataStore?: DataItemInterfaceWithId[];
  tags: string[];
}

export const getDataFilteredByTags = ({ dataStore, tags }: GetDataFilteredByTagsProps) => {
  if (!dataStore) return [];
  if (!tags.length) return dataStore;
  return dataStore.filter((item) => tags.every((tag) => item.tags.includes(tag)));
}
