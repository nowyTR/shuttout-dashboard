import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = props =>
  <div>
    <Bar
      data={props.browserData}
      width={100}
      height={50}
      options={{
        title: {
          display: props.displayTitle,
          text: 'Browsers popularity'
        },
        legend: {
          display: props.displayLegend,
          position: props.legendPosition
        },
        maintainAspectRatio: true
      }}
    />
  </div>;

export default Chart;
