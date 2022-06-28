import React, {FC, useRef, useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryPolarAxis,
  VictoryTheme,
} from 'victory-native';

type Props =  {
	data: {
    voltage?: number,
    current?: number,
    lag?: number
  }
}

const Charts: FC<Props> = ({data}) => {
  console.log(data)
  return (
    <VictoryChart
      polar
      theme={VictoryTheme.material}
      startAngle={0}
      endAngle={360}
    >
      <VictoryPolarAxis
        dependentAxis
        style={{
          axis: {stroke: 'none'},
          tickLabels: {fill: 'none'},
          grid: {stroke: '#ddd', strokeDasharray: '1'},
        }}
        tickValues={[0, 30, 60, 90, 120, 150, 180, 210, 240]}
      />
      <VictoryPolarAxis
        style={{
          grid: {stroke: '#999', strokeDasharray: '1'},
        }}
        tickValues={[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]}
        labelPlacement="vertical"
      />
      <VictoryBar
        style={{data: {fill: 'tomato', width: 4, height: 10}}}
        data={[
          {x: data.voltage, y: data.current},
          {x: 0, y: 0},
          {x: 1, y: 0}
        ]}
      />
       <VictoryBar
        style={{data: {fill: 'tomato', width: 2}}}
        data={[
          {x: 0, y:  data.current},
          {x: 1, y: 1},
        ]}
      />
    </VictoryChart>
  );
};

export default Charts;
