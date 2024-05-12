import {Image, ScrollView} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import {Dimensions} from 'react-native';
import {Share as RNShare} from 'react-native';
import {useDialogsProps} from '@/states/temporary/dialogs';
import React, {useEffect} from 'react';
import AppsModule from '@/lib/apps';
import {useApp} from '@/states/persistent/updateme';

export default function WelcomeDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  const version = useApp(state => state.localVersion);
  return (
    <Portal>
      <Dialog
        style={{position: 'relative'}}
        visible={activeDialog === 'welcome'}
        onDismiss={closeDialog}>
        <Dialog.Title>{`Update Me v${version}`}</Dialog.Title>
        <Dialog.Content
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            marginTop: 20,
            marginBottom: 20,
            gap: 20,
          }}>
          <ScrollView></ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeDialog}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
