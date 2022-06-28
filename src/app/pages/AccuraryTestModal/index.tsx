import React, {FC, useState} from 'react';
import {SafeAreaView, Text, View, StyleSheet, Button} from 'react-native';
import getRealm from '../../../infrastructure/realm';
import {
  IAccurary,
  IAccuraryObject,
} from '../../../accurary/models/interfaces/IAccurary';
import writeAccurary from '../../../accurary/services/writeAccurary';
import changeSchemaAccurary from '../../../migration/migration001';
import Charts from '../Charts';
import Grid from '../Charts/Grid';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 20,
  },
  button: {
    padding: 8,
  },
});

const AccuraryTestModal: FC = () => {
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [lag, setLag] = useState<string>('');

  const write = async () => {
    let firstAccurary: IAccuraryObject;
    const {UUID} = Realm.BSON;

    firstAccurary = await writeAccurary({
      _id: new UUID(),
      voltage: Math.random() * (360 - 1) + 1,
      current: Math.random() * (1 - 0) + 0,
      lag: Math.random() * (1 - 0) + 0,
    });
  };

  const getAccurary = async () => {
    const realm = await getRealm();

    try {
      const data = realm.objects<IAccurary>('Accurary');

      setVoltage((data[data.length - 1]?.voltage || 0).toFixed(3));
      setCurrent((data[data.length - 1]?.current || 0).toFixed(3));
      setLag((data[data.length - 1]?.lag || 0).toFixed(3));
    } catch (error) {
      console.log(error);
    }
  };

  //changeSchemaAccurary();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fdfdfd'}}>
      <View style={styles.container}>
        <Charts
          data={{
            voltage: Number(voltage || 1),
            current: Number(current || 1) * Number(voltage || 1),
            lag: Number(lag || 1) * Number(voltage || 1) 
          }}
        />
        <Grid
          windowWidth={windowWidth}
          data={{voltage: voltage, current: current, lag: lag}}
        />
        <View style={styles.button}>
          <Button title="Write Value" onPress={write} />
        </View>
        <View style={styles.button}>
          <Button title="Get Values" onPress={getAccurary} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccuraryTestModal;
