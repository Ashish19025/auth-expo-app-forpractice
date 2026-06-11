import { View, Text } from 'react-native';

export default function Continue() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>OAuth Callback Reached</Text>
    </View>
  );
}