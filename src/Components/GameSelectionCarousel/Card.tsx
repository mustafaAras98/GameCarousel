import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {GamesType} from '../../Models/Games';

interface CardInterface {
  game: GamesType;
  width: number;
}

const Card: React.FC<CardInterface> = ({game, width}) => {
  const marginH = width / 24;
  return (
    <View
      className="shadow-md h-full"
      style={{
        width: width - marginH * 2,
        marginHorizontal: marginH,
      }}>
      <View
        className="flex-1 rounded-3xl justify-between p-4"
        style={{backgroundColor: game.color}}>
        <View className="basis-2/5">
          <View className="grow p-4 justify-center items-center">
            <Text
              adjustsFontSizeToFit
              className="text-lightext dark:text-darktext text-3xl font-bold tracking-wide line-clamp-1 align-middle text-center">
              {game.title}
            </Text>
          </View>
          <View className="grow rounded-b-2xl justify-center items-center ">
            <Text
              adjustsFontSizeToFit
              className="text-base font-medium align-middle text-center">
              {game.description}
            </Text>
          </View>
        </View>
        <View className="basis-1/5 px-8 justify-center items-center">
          <TouchableOpacity className="bg-amber-950 w-full h-3/5 rounded-full justify-center items-center">
            <Text className="text-base text-darktext dark:text-darktext font-medium align-middle text-center">
              Try it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Card;
