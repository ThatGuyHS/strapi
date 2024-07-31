import type { Schema, Attribute } from '@strapi/strapi';

export interface PlayersPlayer extends Schema.Component {
  collectionName: 'components_players_players';
  info: {
    displayName: 'player';
  };
  attributes: {
    name: Attribute.String;
    role: Attribute.String;
    nickname: Attribute.String;
    image: Attribute.Media;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'players.player': PlayersPlayer;
    }
  }
}
