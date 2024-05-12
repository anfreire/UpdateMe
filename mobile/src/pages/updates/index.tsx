import {Image, View, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Button, Icon, List, Text} from 'react-native-paper';
import {useTheme} from '@/theme';
import {useIndex} from '@/states/temporary';
import {useToast} from '@/states/temporary/toast';
import {useDownloads} from '@/states/temporary/downloads';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useVersions} from '@/states/computed/versions';
import useScreenCallback from '@/hooks/screenCallback';
import ThemedRefreshControl from '@/components/refreshControl';
import LoadingView from '@/components/loadingView';
import {useCurrApp} from '@/states/computed/currApp';

export default function UpdatesScreen({navigation}: {navigation: any}) {
  const theme = useTheme();
  const [updating, setUpdating] = React.useState<Record<string, number>>({});
  const {index, isLoaded} = useIndex(state => ({
    index: state.index,
    isLoaded: state.isLoaded,
  }));
  const defaultProviders = useDefaultProviders(state => state.defaultProviders);
  const {updates, refresh} = useVersions();
  const openToast = useToast().openToast;
  const addDownload = useDownloads().addDownload;
  const setCurrApp = useCurrApp().setCurrApp;

  const updateApp = (appName: string) => {
    setUpdating(prev => ({...prev, [appName]: 0}));
    const provider = defaultProviders[appName];
    addDownload(
      appName + ' ' + index[appName].providers[provider].version + '.apk',
      index[appName].providers[provider].download,
    );
  };

  const updateVersions = () => {
    if (updates.length > 0) {
      setUpdating(prev =>
        Object.keys(prev)
          .filter(appName => updates.includes(appName))
          .reduce((acc, appName) => {
            acc[appName] = prev[appName] ?? 0;
            return acc;
          }, {} as Record<string, number>),
      );
      navigation.setOptions({
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}>
            <Button
              onPress={() => updates.forEach(appName => updateApp(appName))}>
              Update All
            </Button>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => <></>,
      });
    }
  };

  useScreenCallback({
    repeat: {
      callback: refresh,
      interval: 1000,
    },
  });

  useEffect(() => {
    updateVersions();
  }, [updates]);

  return (
    <>
      {isLoaded ? (
        updates.length > 0 ? (
          <ScrollView
            refreshControl={ThemedRefreshControl(theme, {
              onRefresh: refresh,
              refreshing: false,
            })}>
            <List.Section>
              {updates.map(appName => (
                <List.Item
                  key={appName}
                  title={appName}
                  titleStyle={{fontSize: 18}}
                  left={_ => (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 15,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                        source={{uri: index[appName].icon}}
                      />
                    </View>
                  )}
                  right={_ => (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 0,
                        width: 100,
                        minHeight: 40,
                      }}>
                      {Object.keys(updating).includes(appName) ? (
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: theme.schemedTheme.secondary,
                          }}>{`${(updating[appName] * 100).toFixed(0)}%`}</Text>
                      ) : (
                        <Button
                          mode="contained-tonal"
                          onPress={() => updateApp(appName)}>
                          Update
                        </Button>
                      )}
                    </View>
                  )}
                  onPress={() =>
                    openToast(`Long press to enter ${appName} page`)
                  }
                  onLongPress={() => {
                    setCurrApp(appName);
                    navigation.navigate('App-Home' as never, {appName});
                  }}
                />
              ))}
            </List.Section>
          </ScrollView>
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <Icon source="emoticon-sad" size={50} />
            <Text variant="bodyLarge">No updates available</Text>
          </View>
        )
      ) : (
        <LoadingView />
      )}
    </>
  );
}
