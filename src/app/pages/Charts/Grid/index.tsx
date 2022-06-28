import React, {FC, useRef, useState} from 'react';
import {View, Text} from 'react-native';

type Props = {
  windowWidth?: number;
  data: {
    voltage?: string;
    current?: string;
    lag?: string;
  };
};

const Charts: FC<Props> = ({windowWidth, data}) => {
  return (
    <View
      style={{
        width: (windowWidth || 300) - 100,
        minHeight: 200,
        paddingBottom: 18,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <View style={{flex: 1, backgroundColor: '#eaeaea'}}>
        <View
          style={{
            flex: 1,
            maxWidth: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{fontWeight: 'bold'}}>TENSÃO [V]</Text>
        </View>
        <View
          style={{
            flex: 1,
            maxWidth: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{fontWeight: 'bold'}}>CORRENTE [A]</Text>
        </View>
        <View
          style={{
            flex: 1,
            maxWidth: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{fontWeight: 'bold'}}>DEFASAGEM [*]</Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            maxWidth: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>{data.voltage}</Text>
        </View>
        <View
          style={{
            flex: 1,
            maxWidth: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>{data.current}</Text>
        </View>
        <View
          style={{
            flex: 1,
            maxWidth: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>{data.lag}</Text>
        </View>
      </View>
    </View>
  );
};

export default Charts;
