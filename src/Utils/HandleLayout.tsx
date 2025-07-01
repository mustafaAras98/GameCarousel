import {useCallback} from 'react';
import {View} from 'react-native';
import {PositionObjectType} from '../Constants/Constants';

export const useLayoutHelpers = () => {
  const measureRef = useCallback(
    (ref: React.RefObject<View | null>): Promise<PositionObjectType> => {
      return new Promise((resolve) => {
        if (!ref.current) {
          resolve({x: 0, y: 0, width: 0, height: 0});
          return;
        }

        requestAnimationFrame(() => {
          ref.current?.measure((x, y, width, height, pageX, pageY) => {
            resolve({x: pageX, y: pageY, width, height});
          });
        });
      });
    },
    []
  );

  const handleLayout = useCallback(
    (
      ref: React.RefObject<View | null>,
      setPosition: React.Dispatch<React.SetStateAction<PositionObjectType>>
    ) => {
      if (!ref.current) {
        return;
      }

      requestAnimationFrame(() => {
        ref.current?.measure((x, y, width, height, pageX, pageY) => {
          setPosition({x: pageX, y: pageY, width, height});
        });
      });
    },
    []
  );

  const handleLayoutAsync = useCallback(
    async (
      ref: React.RefObject<View | null>,
      setPosition: React.Dispatch<React.SetStateAction<PositionObjectType>>
    ) => {
      const position = await measureRef(ref);
      setPosition(position);
    },
    [measureRef]
  );

  const measureMultipleRefs = useCallback(
    async (
      refs: Array<{
        ref: React.RefObject<View | null>;
        setPosition: React.Dispatch<React.SetStateAction<PositionObjectType>>;
      }>
    ) => {
      const promises = refs.map(async ({ref, setPosition}) => {
        const position = await measureRef(ref);
        setPosition(position);
        return position;
      });

      return Promise.all(promises);
    },
    [measureRef]
  );

  return {
    measureRef,
    handleLayout,
    handleLayoutAsync,
    measureMultipleRefs,
  };
};
