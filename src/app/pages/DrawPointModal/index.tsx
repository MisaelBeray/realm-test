import React, {FC, MutableRefObject, useMemo, useRef, useState} from 'react';
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
  PixelRatio,
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
      flex: 1,
    },
    box: {
      height: 150,
      width: 150,
      backgroundColor: 'blue',
      borderRadius: 5,
    },
  });

  const [startTouchX, setStartTouchX] = useState<number>(0);
  const [startTouchY, setStartTouchY] = useState<number>(0);
  const [endTouchX, setEndTouchX] = useState<number>(0);
  const [endTouchY, setEndTouchY] = useState<number>(0);
  const [pencil, setPencil] = React.useState<boolean>(false);
  const [scale, setScale] = useState<number>(0.8);
  const [move, setMove] = React.useState<boolean>(false);
  const [state, setState] = React.useState({open: false});
  const onStateChange = ({open}: any) => setState({open});
  const [response, setResponse] = React.useState<any>(null);
  const {open} = state;
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
          //console.log('onStartShouldSetPanResponder');
          return true;
        },
        onStartShouldSetPanResponderCapture: (evt, gestureState) => {
          //console.log('onStartShouldSetPanResponderCapture');
          if (pencil) {
            setEndTouchX(evt.nativeEvent.locationX);
            setEndTouchY(evt.nativeEvent.locationY);
            setStartTouchX(evt.nativeEvent.locationX);
            setStartTouchY(evt.nativeEvent.locationY);
          }
          return true;
        },
        onMoveShouldSetPanResponder: (event, gestureState) => {
          //console.log('onMoveShouldSetPanResponder');
          return false;
        },
        onMoveShouldSetPanResponderCapture: (event, gestureState) => {
          //console.log('onMoveShouldSetPanResponderCapture');
          return false;
        },
        onPanResponderGrant: (event, gestureState) => {
          return false;
        },
        onPanResponderMove: move
          ? Animated.event([null, {dx: pan.x, dy: pan.y}], {
              useNativeDriver: false,
            })
          : undefined,
        onPanResponderRelease: evt => {
          //console.log('onPanResponderRelease');
          pan.extractOffset();

          if (pencil) {
            setEndTouchX(evt.nativeEvent.locationX);
            setEndTouchY(evt.nativeEvent.locationY);
          }
        },
      }),
    [pencil, move],
  );

  /* console.log('startTouchX: ', startTouchX);
  console.log('startTouchY: ', startTouchY);
  console.log('endTouchX: ', endTouchX);
  console.log('endTouchY: ', endTouchY); */

  return (
    <View style={styles.MainContainer}>
      <View style={styles.childView}>
        <Animated.View
          style={{
            transform: [
              {translateX: pan.x},
              {translateY: pan.y},
              {scale: scale},
            ],
          }}
          {...panResponder.panHandlers}
        >
          <View key={response?.assets[0]?.uri} style={styles.image}>
            <ImageBackground
              resizeMode="stretch"
              style={{
                width: response?.assets[0]?.width,
                height: response?.assets[0]?.height,
              }}
              source={{uri: response?.assets[0]?.uri}}
            />
          </View>
          {!!endTouchX && !!endTouchY && (
            <Svg
              height={response?.assets[0]?.height}
              width={response?.assets[0]?.width}
            >
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
        </Animated.View>
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
            onPress: () => {},
          },
          {
            icon: 'magnify-plus',
            small: false,
            onPress: () => {
              if (scale < 2) setScale(scale + 0.4);
            },
          },
          {
            icon: 'magnify-minus',
            small: false,
            onPress: () => {
              if (scale > 0.4) setScale(scale - 0.4);
            },
          },
          {
            icon: 'arrow-all',
            small: false,
            color: move ? 'red' : 'gray',
            onPress: () => {
              setMove(!move);
            },
          },
          {
            icon: 'pencil',
            small: false,
            color: pencil ? 'red' : 'gray',
            onPress: () => {
              setPencil(!pencil);
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
