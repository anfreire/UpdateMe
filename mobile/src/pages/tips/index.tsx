import {View} from 'react-native';
import {Text} from 'react-native-paper';

export default function TipsScreen() {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text variant="headlineLarge">Coming Soon...</Text>
    </View>
  );
}
