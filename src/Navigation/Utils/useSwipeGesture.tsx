import {Dimensions} from 'react-native';
import {Gesture} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {BottomTabParamList, RootStackNavigationProp} from './NavigationTypes';
import {useEffect} from 'react';

const TAB_ORDER: (keyof BottomTabParamList)[] = [
  'Rankings',
  'Home',
  'Settings',
];

const useSwipeGesture = () => {
  const {width} = Dimensions.get('window');
  const edgeWidth = width * 0.4;

  const startXRef = useSharedValue(0);

  const navigation = useNavigation<RootStackNavigationProp>();

  const navigationState = useNavigationState((state) => state);
  const isTabState = navigationState?.type === 'tab';

  const routes = isTabState ? navigationState.routes : [];
  const currentRouteIndex = isTabState ? navigationState.index : -1;

  const latestRoutes = useSharedValue(routes);
  const latestCurrentRouteIndex = useSharedValue(currentRouteIndex);

  useEffect(() => {
    latestRoutes.value = routes;
    latestCurrentRouteIndex.value = currentRouteIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, currentRouteIndex]);

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      startXRef.value = event.absoluteX;
    })
    .activeOffsetX([-40, 40])
    .failOffsetY([-20, 20])
    .onEnd((event) => {
      const currentRoutes = latestRoutes.value;
      const currentIndex = latestCurrentRouteIndex.value;

      if (!currentRoutes || currentRoutes.length === 0 || currentIndex === -1) {
        return;
      }

      const swipeThreshold = 40;
      const velocityThreshold = 0.4;

      const isLeftEdge = startXRef.value <= edgeWidth;
      const isRightEdge = startXRef.value >= width - edgeWidth;

      let nextIndex = -1;

      if (
        isRightEdge &&
        (event.translationX < -swipeThreshold ||
          event.velocityX < -velocityThreshold)
      ) {
        nextIndex = Math.min(currentIndex + 1, TAB_ORDER.length - 1);
      } else if (
        isLeftEdge &&
        (event.translationX > swipeThreshold ||
          event.velocityX > velocityThreshold)
      ) {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      if (nextIndex !== -1 && nextIndex !== currentIndex) {
        const nextTabName = TAB_ORDER[nextIndex];
        navigation.navigate('TabNavigation', {
          screen: nextTabName,
        });
      }
    });

  return panGesture;
};

export default useSwipeGesture;
