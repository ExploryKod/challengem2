import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import {
  KitchenScreen,
  RestaurantSelectScreen,
  HistoryScreen,
  HttpKitchenGateway,
} from './src/modules/kitchen';

const BASE_URL = 'http://localhost:3000';
const gateway = new HttpKitchenGateway(BASE_URL);

type SelectedRestaurant = {
  id: number;
  name: string;
} | null;

type Screen = 'select' | 'kitchen' | 'history';

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<SelectedRestaurant>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('select');

  const handleSelectRestaurant = (id: number, name: string) => {
    setSelectedRestaurant({ id, name });
    setCurrentScreen('kitchen');
  };

  const handleBackToSelect = () => {
    setSelectedRestaurant(null);
    setCurrentScreen('select');
  };

  const handleGoToHistory = () => {
    setCurrentScreen('history');
  };

  const handleBackToKitchen = () => {
    setCurrentScreen('kitchen');
  };

  const renderScreen = () => {
    if (!selectedRestaurant || currentScreen === 'select') {
      return (
        <RestaurantSelectScreen
          baseUrl={BASE_URL}
          onSelect={handleSelectRestaurant}
        />
      );
    }

    if (currentScreen === 'history') {
      return (
        <HistoryScreen
          gateway={gateway}
          restaurantId={selectedRestaurant.id}
          restaurantName={selectedRestaurant.name}
          onBack={handleBackToKitchen}
        />
      );
    }

    return (
      <KitchenScreen
        gateway={gateway}
        restaurantId={selectedRestaurant.id}
        restaurantName={selectedRestaurant.name}
        onBack={handleBackToSelect}
        onHistory={handleGoToHistory}
      />
    );
  };

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      {renderScreen()}
    </Provider>
  );
}
