// FileViewerScreen.jsx
import { View } from 'react-native';
import { WebView } from 'react-native-webview';


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
      />

    </View>
  );
}
