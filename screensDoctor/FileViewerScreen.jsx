// FileViewerScreen.jsx

import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import theme from '../style/theme';

export default function FileViewerScreen({ route }) {
  const { fileUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: fileUrl }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 20 }}
          />
        )}
      />
    </View>
  );
}
