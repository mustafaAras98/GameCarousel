import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  LayoutChangeEvent,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  SharedValue,
  AnimatedStyle,
} from 'react-native-reanimated';

import {games, GamesType} from '../../Models/Games';
import {Colors} from '../../Constants/Colors';

import Tooltip from '../Tooltip';
import {PositionType} from '../Tooltip/Tooltip';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {gameManager} from '../../Screens/Games/GameManager';
import {RootStackParamList} from '../../Navigation/Utils/NavigationTypes';

interface MeasureElementProps<T> {
  data: T[];
  renderItem: (item: GamesType, index: number) => React.ReactNode;
  onLayout: (width: number) => void;
}

interface TranslatedElementProps {
  index: number;
  children: React.ReactNode;
  offset: SharedValue<number>;
  blockWidth: number;
}

interface ChildrenScrollerProps<GamesType> {
  data: GamesType[];
  renderItem: (
    item: GamesType,
    index: number,
    toggleAnimation: Dispatch<SetStateAction<boolean>>
  ) => React.ReactNode;
  duration: number;
  blockWidth: number;
  parentWidth: number;
}

interface MarqueeProps<T> {
  data: T[];
  renderItem: (
    item: GamesType,
    index: number,
    parentHeight: number,
    ToggleAnimation: Dispatch<SetStateAction<boolean>>
  ) => React.ReactNode;
  duration?: number;
}
interface ClonerProps {
  count: number;
  renderChild: (index: number) => React.ReactNode;
}

interface TooltipInfo {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
  gameData: GamesType | null;
  show: boolean;
}

const MeasureElement = React.memo(
  ({data, renderItem, onLayout}: MeasureElementProps<GamesType>) => (
    <Animated.ScrollView
      horizontal
      className="absolute -top-9999 -left-9999 opacity-0 -z-1"
      pointerEvents="box-none"
      onContentSizeChange={(w) => {
        onLayout(w);
      }}>
      <View className="flex-row">
        {data.map((item, index) => renderItem(item, index))}
      </View>
    </Animated.ScrollView>
  )
);

const TranslatedElement = React.memo<TranslatedElementProps>(
  ({index, children, offset, blockWidth}) => {
    const animatedStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle(() => {
      return {
        left: index * blockWidth,
        transform: [{translateX: -offset.value}],
      };
    });

    return (
      <Animated.View
        className="flex-row absolute top-0 h-full justify-center"
        style={[animatedStyle, {width: blockWidth}]}>
        {children}
      </Animated.View>
    );
  }
);

const getIndicesArray = (length: number): number[] =>
  Array.from({length}, (_, i) => i);

const Cloner = React.memo<ClonerProps>(({count, renderChild}) => (
  <>{getIndicesArray(count).map(renderChild)}</>
));

const ChildrenScroller = React.memo(
  <T extends GamesType>({
    data,
    renderItem,
    duration,
    blockWidth,
    parentWidth,
  }: ChildrenScrollerProps<T>) => {
    const offset = useSharedValue(0);
    const [isAnimationActive, setIsAnimationActive] = useState(true);

    useFrameCallback((frameInfo) => {
      if (!frameInfo.timeSincePreviousFrame) {
        return;
      }
      if (!isAnimationActive) {
        return;
      }

      const pixelsToMove =
        (frameInfo.timeSincePreviousFrame / duration) * blockWidth;
      offset.value = (offset.value + pixelsToMove) % blockWidth;
    }, true);

    const count = Math.round(parentWidth / blockWidth) + 2;

    const renderChild = useCallback(
      (cloneIndex: number) => (
        <TranslatedElement
          key={`clone-${cloneIndex}`}
          index={cloneIndex}
          offset={offset}
          blockWidth={blockWidth}>
          {data.map((item, index) =>
            renderItem(item, index, setIsAnimationActive)
          )}
        </TranslatedElement>
      ),
      [blockWidth, data, offset, renderItem]
    );
    return <Cloner count={count} renderChild={renderChild} />;
  }
);

const Marquee = React.memo(
  ({data, renderItem, duration = 2000}: MarqueeProps<GamesType>) => {
    const [parentLayout, setParentLayout] = useState({width: 0, height: 0});
    const [blockWidth, setBlockWidth] = useState(0);

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
      const {width, height} = event.nativeEvent.layout;
      setParentLayout({width, height});
    }, []);

    const handleBlockWidthLayout = useCallback((width: number) => {
      setBlockWidth(width);
    }, []);

    const adaptedRenderItem = useCallback(
      (
        item: GamesType,
        index: number,
        toggleAnimation: Dispatch<SetStateAction<boolean>>
      ) => {
        if (parentLayout.height > 0) {
          return renderItem(item, index, parentLayout.height, toggleAnimation);
        }

        return null;
      },

      [renderItem, parentLayout.height]
    );

    if (!data || data.length === 0 || !renderItem) {
      return null;
    }

    return (
      <View
        className="w-full h-full bg-lightaccent dark:bg-darkaccent overflow-hidden rounded-xl"
        onLayout={handleLayout}
        pointerEvents="box-none">
        <View className="w-full h-full relative" pointerEvents="box-none">
          {parentLayout.height > 0 && (
            <MeasureElement
              data={data}
              renderItem={(item, index) =>
                renderItem(item, index, parentLayout.height, () => {})
              }
              onLayout={handleBlockWidthLayout}
            />
          )}
          {blockWidth > 0 &&
            parentLayout.width > 0 &&
            parentLayout.height > 0 && (
              <ChildrenScroller
                data={data}
                renderItem={adaptedRenderItem}
                duration={duration}
                parentWidth={parentLayout.width}
                blockWidth={blockWidth}
              />
            )}
        </View>
      </View>
    );
  }
);

const GameItem = React.memo(
  ({
    game,
    parentHeight,
    onToggleAnimation,
    updateTooltipInfo,
    clearTooltipInfo,
  }: {
    game: GamesType;
    parentHeight: number;
    onToggleAnimation: React.Dispatch<React.SetStateAction<boolean>>;
    updateTooltipInfo: (
      pageX: number,
      pageY: number,
      width: number,
      height: number,
      gameData: GamesType
    ) => void;
    clearTooltipInfo: () => void;
  }) => {
    const touchableRef = useRef<any>(null);
    const handlePressIn = () => {
      onToggleAnimation(false);
      touchableRef.current?.measure(
        (
          _x: number,
          _y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          updateTooltipInfo(pageX, pageY, width, height, game);
        }
      );
    };

    const handlePressOut = () => {
      onToggleAnimation(true);
      clearTooltipInfo();
    };

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const handlePress = () => {
      gameManager.startGameFromId(game.id, navigation);
    };

    return (
      <View
        style={[styles.gameShadow, {height: parentHeight, width: parentHeight}]}
        className="p-2">
        <TouchableOpacity
          ref={touchableRef}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="p-1 bg-lighttext dark:bg-darktext rounded-full justify-center items-center"
          accessibilityRole="button"
          accessibilityLabel={`${game.title} oyununu oyna`}>
          <Image
            resizeMode="contain"
            className="h-full w-full"
            source={game.imgSrc}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

function GameMarquee() {
  const publishedGames = useMemo(() => {
    return games?.filter((game) => game.isPublished) ?? [];
  }, []);

  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo>({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
    gameData: null,
    show: false,
  });

  const marqueeContainerRef = useRef<View | null>(null);
  const [containerPosition, setContainerPosition] = useState({
    pageX: 0,
    pageY: 0,
  });
  const measureContainerPosition = useCallback(() => {
    marqueeContainerRef.current?.measure(
      (_x, _y, _width, _height, pageX, pageY) => {
        setContainerPosition({pageX, pageY});
      }
    );
  }, []);

  useEffect(() => {
    if (marqueeContainerRef.current) {
      measureContainerPosition();
    }
  }, [measureContainerPosition]);

  const updateTooltipInfo = useCallback(
    (
      pageX: number,
      pageY: number,
      width: number,
      height: number,
      gameData: GamesType
    ) => {
      setTooltipInfo({
        pageX,
        pageY,
        width,
        height,
        gameData,
        show: true,
      });
    },
    []
  );

  const clearTooltipInfo = useCallback(() => {
    setTooltipInfo({
      pageX: 0,
      pageY: 0,
      width: 0,
      height: 0,
      gameData: null,
      show: false,
    });
  }, []);

  const marqueeRenderItem = useCallback(
    (
      game: GamesType,
      index: number,
      parentHeight: number,
      toggleAnimation: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      return (
        <GameItem
          key={`game-${index}`}
          game={game}
          parentHeight={parentHeight}
          onToggleAnimation={toggleAnimation}
          updateTooltipInfo={updateTooltipInfo}
          clearTooltipInfo={clearTooltipInfo}
        />
      );
    },

    [updateTooltipInfo, clearTooltipInfo]
  );

  const getPositionType = useCallback((): PositionType => {
    const screenWidth = Dimensions.get('screen').width;
    const x = tooltipInfo.pageX;

    const LEFT_EDGE = screenWidth * 0.25;
    const RIGHT_EDGE = screenWidth * 0.625;

    if (x < LEFT_EDGE) {
      return PositionType.Right;
    }
    if (x > RIGHT_EDGE) {
      return PositionType.Left;
    }

    return PositionType.Top;
  }, [tooltipInfo.pageX]);

  return (
    <View
      className="flex justify-center items-center relative px-4"
      ref={marqueeContainerRef}
      onLayout={measureContainerPosition}>
      <View className="w-full justify-center items-center">
        <Marquee
          data={publishedGames}
          renderItem={marqueeRenderItem}
          duration={10000}
        />
      </View>
      {tooltipInfo.show && tooltipInfo.gameData && tooltipInfo.width > 0 && (
        <Tooltip
          context={tooltipInfo.gameData.title}
          position={getPositionType()}
          height={tooltipInfo.height}
          width={tooltipInfo.width}
          x={tooltipInfo.pageX - containerPosition.pageX}
          y={tooltipInfo.pageY - containerPosition.pageY}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gameShadow: {
    shadowColor: Colors.DarkTheme.Background,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 2.22,
    elevation: 5,
  },
});

export default React.memo(GameMarquee);
