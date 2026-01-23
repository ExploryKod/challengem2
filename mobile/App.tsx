import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { KitchenScreen, StubKitchenGateway } from './src/modules/kitchen';

// Use stub gateway for development - replace with HttpKitchenGateway for production
const gateway = new StubKitchenGateway();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <KitchenScreen gateway={gateway} />
    </Provider>
  );
}
