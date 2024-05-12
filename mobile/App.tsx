/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import Pages from '@/pages';
import FilesModule from '@/lib/files';
import {useTheme} from '@/theme';
import DrawerWrapper from '@/global/drawer';
import {useSettings} from '@/states/persistent/settings';
import {useDialogs} from '@/states/temporary/dialogs';
import {useApp} from '@/states/persistent/updateme';

function App(): React.JSX.Element {
  const theme = useTheme();
  const deleteOnLeave = useSettings(
    state => state.settings.downloads.deleteOnLeave,
  );
  const app = useApp();
  const openDialog = useDialogs().openDialog;

  useEffect(() => {
    if (app.info.version > app.localVersion) openDialog('newVersion');
    else if (!app.flags.welcome) openDialog('welcome');
  }, [app.info]);

  useEffect(() => {
    const fun = () => deleteOnLeave && FilesModule.deleteAllFiles();
    fun();

    return () => {
      fun();
    };
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={theme.schemedTheme.surfaceContainer}
        barStyle={
          theme.colorScheme === 'dark' ? 'light-content' : 'dark-content'
        }
      />
      <SafeAreaView>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <DrawerWrapper>
            <Pages />
          </DrawerWrapper>
        </View>
      </SafeAreaView>
    </>
  );
}

export default App;
