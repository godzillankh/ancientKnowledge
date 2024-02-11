import React from 'react';
import { DataItemInterfaceWithId } from '../typesInterfaces/dataItem';
import { PieChart } from '@mui/x-charts/PieChart';

interface Props {
  tagsSection: string[];
  dataSection: DataItemInterfaceWithId[]
}

const GraphicsSection = ({ tagsSection, dataSection }: Props) => {

  // @ts-expect-error TODO
  const objectDepth = (o) =>
    Object (o) === o ? 1 + Math .max (-1, ... Object .values(o) .map (objectDepth)) : 0

  // @ts-expect-error TODO
  const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  const getGraphicData = () => {
    const allTagsObject = {};


    // Transform tags array to an object
    dataSection.forEach((item) => {
      const itemTagsCleaned = item.tags.filter((tagItem) => !tagsSection.includes(tagItem));
      itemTagsCleaned.reduce((obj, tag) => {
        const isLastTag = item.tags[item.tags.length - 1] === tag;

        // @ts-expect-error converting array to object
        return obj[tag] = isLastTag ? (obj[tag] || 0) + item.field2 : {};
      }, allTagsObject);
    });

    // TODO
    const depthLevel = objectDepth(allTagsObject);
    console.log('depthLevel: ', depthLevel);

    const datagRaphic =Object.keys(allTagsObject).map((tagKey) => {
      // @ts-expect-error TODO
      const value = allTagsObject[tagKey];
      if (typeof value === 'number') return { label: tagKey, value: value };
      return { label: tagKey, value: sumValues(value) }
    })

    return [{
      innerRadius: 0,
      outerRadius: 80,
      data: datagRaphic || []
    }]

  }

  const series = getGraphicData();

  return (
    <PieChart
      /* @ts-expect-error TODO */
      series={series}
      width={400}
      height={300}
      slotProps={{
        legend: { hidden: true },
      }}
    />
  );
}

export default GraphicsSection;
