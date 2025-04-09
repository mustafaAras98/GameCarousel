import {StyleSheet} from 'react-native';
import {
  BasePadding,
  Colors,
  getBorderRadius,
  RadiusType,
} from '../../Constants/Constants';

export const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Track: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: '100%',
    minHeight: '100%',
    padding: BasePadding.medium,
    borderRadius: getBorderRadius(RadiusType.Pill, 999),
  },
  Thumb: {
    aspectRatio: 1,
    backgroundColor: Colors.Common.White,
    borderRadius: getBorderRadius(RadiusType.Circle, 999),
  },
  IconContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
