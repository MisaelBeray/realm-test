import React, {FC, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {FAB} from 'react-native-paper';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import {DragTextEditor} from 'react-native-drag-text-editor';
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
  const [scale, setScale] = useState<number>(1);
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
          setImagePosition(new Animated.ValueXY(pan));

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

  const [imagePosition, setImagePosition] = useState<Animated.ValueXY>(pan);

  const WINDOW = Dimensions.get('window');

  const [addText, setAddText] = useState<TextEditor[]>([]);

  interface TextEditor {
    minWidth: number;
    minHeight: number;
    w: number;
    h: number;
    x: number;
    y: number;
    FontColor: string;
    LineHeight: number;
    TextAlign: string;
    LetterSpacing: number;
    FontSize: number;
    isDraggable: boolean;
    isResizable: boolean;
    value: string;
  }
  return (
    <View style={styles.MainContainer}>
      <ViewShot
        style={{
          width: response?.assets[0]?.width,
          height: response?.assets[0]?.height,
        }}
        ref={viewShotRef}
        options={{format: 'jpg', quality: 1}}>
        <Animated.View
          style={{
            transform: [
              {translateX: imagePosition?.x},
              {translateY: imagePosition?.y},
              {scale: scale},
            ],
          }}
          {...panResponder.panHandlers}>
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
        </Animated.View>
        {addText.map((text, index) => {
          return (
            <DragTextEditor
              key={index}
              minWidth={text.minWidth}
              minHeight={text.minHeight}
              w={text.w}
              h={text.h}
              x={text.x}
              y={text.y}
              FontColor={text.FontColor}
              LineHeight={text.LineHeight}
              TextAlign={text.TextAlign}
              LetterSpacing={text.LetterSpacing}
              FontSize={text.FontSize}
              isDraggable={text.isDraggable}
              isResizable={text.isResizable}
              text=""
            />
          );
        })}
      </ViewShot>

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
              setScale(1);
              setImagePosition(new Animated.ValueXY());

              /* viewShotRef?.current?.capture?.().then(uri => {
                CameraRoll.save(uri);
              }); */
            },
          },
          {
            icon: 'tooltip-text-outline',
            small: false,
            onPress: () => {
              const text: TextEditor = {
                minWidth: 40,
                minHeight: 40,
                w: 80,
                h: 80,
                x: WINDOW.width / 4,
                y: WINDOW.height / 3,
                FontColor: 'red',
                LineHeight: 15,
                TextAlign: 'left',
                LetterSpacing: 0,
                FontSize: 22,
                isDraggable: true,
                isResizable: true,
                value: '',
              };

              setAddText(arr => [...arr, text]);
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
