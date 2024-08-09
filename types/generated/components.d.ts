import type { Schema, Attribute } from '@strapi/strapi';

export interface HandlingArsmoeteshandling extends Schema.Component {
  collectionName: 'components_handling_arsmoeteshandlings';
  info: {
    displayName: 'arsm\u00F6teshandling';
  };
  attributes: {
    name: Attribute.String;
    link: Attribute.String;
  };
}

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

export interface LandslagResultatResultat extends Schema.Component {
  collectionName: 'components_landslag_resultat_resultats';
  info: {
    displayName: 'resultat';
  };
  attributes: {
    match: Attribute.String;
    score: Attribute.String;
    resultlink: Attribute.String;
    image: Attribute.Media;
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
      'handling.arsmoeteshandling': HandlingArsmoeteshandling;
      'kansli.member': KansliMember;
      'landslag-resultat.resultat': LandslagResultatResultat;
      'players.player': PlayersPlayer;
    }
  }
}
