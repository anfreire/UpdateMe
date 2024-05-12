import {Button, Text, TouchableRipple} from 'react-native-paper';
import {useEffect, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {Dimensions, Image, View} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useScreenCallback from '../../../hooks/screenCallback';
import AppsModule from '../../../lib/apps';
import {AppScreenChildProps} from '..';
import {useTheme, useThemeProps} from '@/theme';
import {IndexProps} from '@/states/temporary';

interface bannerData {
  'Missing dependencies': string[];
  'Outdated dependencies': string[];
  'Outdated complementary apps': string[];
}

const clearedBannerData: bannerData = {
  'Missing dependencies': [],
  'Outdated dependencies': [],
  'Outdated complementary apps': [],
};

const Dependency = ({
  title,
  dependencies,
  setCurrApp,
  index,
  theme,
}: {
  title: string;
  dependencies: string[];
  setCurrApp: any;
  index: IndexProps;
  theme: useThemeProps;
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: 100,
        gap: 10,
      }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
        }}>
        {title}
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          width: '100%',
        }}>
        {dependencies.map((dep, i) => (
          <View
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableRipple onPress={() => setCurrApp(dep)}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  gap: 2,
                }}>
                <Image
                  resizeMode="contain"
                  source={{uri: index[dep].icon}}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
                <Text>{dep}</Text>
              </View>
            </TouchableRipple>
            {dependencies.length > 1 && i < dependencies.length - 1 && (
              <View
                style={{
                  width: 1,
                  height: 50,
                  marginHorizontal: 20,
                  opacity: 0.5,
                  backgroundColor: theme.schemedTheme.surfaceContainerLowest,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default function RelatedAppsBanner(props: AppScreenChildProps) {
  const theme = useTheme();
  const height = useSharedValue(0);
  const [data, setData] = useState<bannerData>(clearedBannerData);
  const [keys, setKeys] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<boolean>(false);

  const open = () =>
    (height.value = withTiming(115, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    }));

  const close = () =>
    (height.value = withTiming(0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    }));

  useScreenCallback({
    initial: () => {
      setDismissed(false);
    },
  });

  useEffect(() => {
    if (dismissed) close();
  }, [dismissed]);

  useEffect(() => {
    close();
    if (dismissed || !props.currApp || !props.currApp.version) return;
    setData(_ => {
      const newData = {
        'Missing dependencies': props.currApp.depends.filter(
          dep => !props.versions[dep],
        ),
        'Outdated dependencies': props.currApp.depends.filter(dep =>
          props.updates.includes(dep),
        ),
        'Outdated complementary apps': props.currApp.complements.filter(
          complement => props.updates.includes(complement),
        ),
      };

      setKeys(
        Object.keys(newData).filter(key => (newData as any)[key].length > 0),
      );
      if (Object.values(newData).some(arr => arr.length > 0)) open();
      else close();
      return newData;
    });
  }, [props.currApp]);

  return (
    <Animated.View
      style={{
        backgroundColor: theme.schemedTheme.surfaceContainerHigh,
        width: Dimensions.get('window').width,
        height,
        overflow: 'hidden',
        position: 'relative',
      }}>
      {!dismissed && keys.length > 0 && (
        <>
          <Carousel
            width={Dimensions.get('window').width}
            height={100}
            loop
            withAnimation={{
              type: 'timing',
              config: {
                duration: 10000,
                easing: Easing.linear,
              },
            }}
            autoPlayInterval={0}
            autoPlay={keys.length > 1}
            enabled={keys.length > 1}
            data={keys}
            renderItem={({item}: {item: string}) => (
              <Dependency
                key={item}
                title={item}
                dependencies={(data as any)[item]}
                setCurrApp={props.setCurrApp}
                index={props.index}
                theme={theme}
              />
            )}
          />
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              right: 0,
              bottom: 0,
            }}>
            <Button onPress={() => setDismissed(true)}>Dismiss</Button>
          </View>
        </>
      )}
    </Animated.View>
  );
}
