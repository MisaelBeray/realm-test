import React, {FC, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  ImageBackground,
} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {FAB} from 'react-native-paper';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
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
    box: {
      height: 150,
      width: 150,
      backgroundColor: 'blue',
      borderRadius: 5,
    },
  });
  const viewShotRef = useRef<ViewShot>(null);
  const [pencil, setPencil] = React.useState<boolean>(false);
  const [scale, setScale] = useState<number>(0.8);
  const [move, setMove] = React.useState<boolean>(false);
  const [state, setState] = React.useState({open: false});
  const onStateChange = ({open}: any) => setState({open});
  const [response, setResponse] = React.useState<any>(null);
  const {open} = state;
  const pan = useRef(new Animated.ValueXY()).current;

  const [drawLineTouch, setDrawLineTouch] = React.useState<IDrawLine[]>([]);

  let drawLine: IDrawLine = {};

  interface IDrawLine {
    startX?: number;
    endX?: number;
    startY?: number;
    endY?: number;
  }

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
            drawLine = {
              startX: evt.nativeEvent.locationX,
              startY: evt.nativeEvent.locationY,
              endX: evt.nativeEvent.locationX,
              endY: evt.nativeEvent.locationY,
            };
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
            drawLine = {
              startX: drawLine.startX,
              startY: drawLine.startY,
              endX: evt.nativeEvent.locationX,
              endY: evt.nativeEvent.locationY,
            };

            setDrawLineTouch(arr => [...arr, drawLine]);
          }
        },
      }),
    [pencil, move],
  );

  return (
    <View style={styles.MainContainer}>
      <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}, {scale: scale}],
        }}
        {...panResponder.panHandlers}>
        <ViewShot
          style={{
            width: response?.assets[0]?.width,
            height: response?.assets[0]?.height,
          }}
          ref={viewShotRef}
          options={{format: 'jpg', quality: 1}}>
          <ImageBackground
            resizeMode="stretch"
            style={{
              flex: 1,
              width: response?.assets[0]?.width,
              height: response?.assets[0]?.height,
            }}
            source={{uri: response?.assets[0]?.uri}}
          />

          <Svg
            height={response?.assets[0]?.height}
            width={response?.assets[0]?.width}>
            {drawLineTouch?.map((item: IDrawLine, index) => {
              return (
                <Line
                  key={index}
                  x1={item.startX}
                  y1={item.startY}
                  x2={item.endX}
                  y2={item.endY}
                  stroke="red"
                  strokeWidth="8"
                />
              );
            })}
          </Svg>
        </ViewShot>
      </Animated.View>

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
              viewShotRef?.current?.capture?.().then(uri => {
                CameraRoll.save(uri);
              });
            },
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
