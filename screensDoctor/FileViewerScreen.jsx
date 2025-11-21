// FileViewerScreen.jsx

import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import theme from '../style/theme';

export default function FileViewerScreen({ route }) {
  const { fileUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: fileUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowFileAccess={true}
        allowsInlineMediaPlayback={true}
      />

    </View>
  );
}
