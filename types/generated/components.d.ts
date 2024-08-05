import type { Schema, Attribute } from '@strapi/strapi';

export interface KansliMember extends Schema.Component {
  collectionName: 'components_kansli_members';
  info: {
    displayName: 'Member';
  };
  attributes: {
    firstname: Attribute.String;
    lastname: Attribute.String;
    role: Attribute.String;
    profilepicture: Attribute.Media;
  };
}

export interface PlayersPlayer extends Schema.Component {
  collectionName: 'components_players_players';
  info: {
    displayName: 'player';
    description: '';
  };
  attributes: {
    firstname: Attribute.String;
    role: Attribute.String;
    nickname: Attribute.String;
    image: Attribute.Media;
    lastname: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'kansli.member': KansliMember;
      'players.player': PlayersPlayer;
    }
  }
}
