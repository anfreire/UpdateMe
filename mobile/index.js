/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import { ThemeProvider } from '@/theme';
import { ToastWrapper } from '@/global/toast';
import { DialogsWrapper } from '@/global/dialogs';

function Root() {
  return (
    <ThemeProvider>
      <ToastWrapper>
        <DialogsWrapper>
          <App />
        </DialogsWrapper>
      </ToastWrapper>
    </ThemeProvider>
  );
}

AppRegistry.registerComponent(appName, () => Root);
