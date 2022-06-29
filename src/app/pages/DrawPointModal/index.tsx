import React, {FC, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  PanResponder,
  Image,
  Dimensions,
  Animated,
  Alert,
  ImageBackground,
} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {FAB, Portal, Provider} from 'react-native-paper';
const DrawPointModal: FC = () => {
  const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
    },

    childView: {
      flex: 1,
      overflow: 'hidden',
    },
    point: {
      height: 22,
      width: 22,
      marginTop: 5,
      position: 'absolute',
      borderRadius: 14,
      backgroundColor: '#afeeee',
    },
    fab: {
      backgroundColor: '#EA5B70',
    },
    image: {
      flex: 1
    },
  });

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const pan = useRef(new Animated.ValueXY()).current;
  const [startTouchX, setStartTouchX] = useState<number>(0);
  const [startTouchY, setStartTouchY] = useState<number>(0);
  const [endTouchX, setEndTouchX] = useState<number>(0);
  const [endTouchY, setEndTouchY] = useState<number>(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        console.log('onStartShouldSetPanResponder');
        return true;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        console.log('onStartShouldSetPanResponderCapture');
        setEndTouchX(0);
        setEndTouchY(0);
        setStartTouchX(evt.nativeEvent.locationX);
        setStartTouchY(evt.nativeEvent.locationY);
        return true;
      },
      onMoveShouldSetPanResponder: (event, gestureState) => {
        console.log('onMoveShouldSetPanResponder');
        return false;
      },
      onMoveShouldSetPanResponderCapture: (event, gestureState) => {
        console.log('onMoveShouldSetPanResponderCapture');
        return false;
      },
      onPanResponderGrant: (event, gestureState) => {
        console.log('onPanResponderGrant');
        return false;
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: evt => {
        console.log('onPanResponderRelease');
        setEndTouchX(evt.nativeEvent.locationX);
        setEndTouchY(evt.nativeEvent.locationY);
      },
    }),
  ).current;

  const [state, setState] = React.useState({open: false});

  const onStateChange = ({open}: any) => setState({open});

  const [response, setResponse] = React.useState<any>(null);

  const {open} = state;

  console.log('startTouchX: ', startTouchX);
  console.log('startTouchY: ', startTouchY);
  console.log('endTouchX: ', endTouchX);
  console.log('endTouchY: ', endTouchY);

  return (
    <View style={styles.MainContainer}>
      <View style={styles.childView}>
        <View
          style={{flex: 1, backgroundColor: 'transparent'}}
          {...panResponder.panHandlers}
        >
          <View key={response?.assets[0]?.uri} style={styles.image}>
            <ImageBackground
              resizeMode="cover"
             
              style={{width: width, height: height}}
              source={{uri: response?.assets[0]?.uri}}
            />
          </View>
          {!!endTouchX && !!endTouchY && (
            <Svg height={height} width={width}>
              <Line
                x1={startTouchX}
                y1={startTouchY}
                x2={endTouchX}
                y2={endTouchY}
                stroke="red"
                strokeWidth="8"
              />
            </Svg>
          )}
        </View>
      </View>
      <FAB.Group
        fabStyle={styles.fab}
        open={open}
        icon={open ? 'minus' : 'plus'}
        visible={true}
        actions={[
          {
            icon: 'camera',
            small: false,
            onPress: () => {
              launchCamera(
                {
                  saveToPhotos: true,
                  mediaType: 'photo',
                  includeBase64: false,
                },
                setResponse,
              );
            },
          },
          {
            icon: 'image-area',
            small: false,
            onPress: () => {
              launchImageLibrary(
                {
                  selectionLimit: 0,
                  mediaType: 'photo',
                  includeBase64: false,
                },
                setResponse,
              );
            },
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </View>
  );
};

export default DrawPointModal;
