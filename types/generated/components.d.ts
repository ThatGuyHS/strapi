import type { Schema, Attribute } from '@strapi/strapi';

export interface HandlingArsmoeteshandling extends Schema.Component {
  collectionName: 'components_handling_arsmoeteshandlings';
  info: {
    displayName: 'arsm\u00F6teshandling';
    description: '';
  };
  attributes: {
    namn: Attribute.String;
    link: Attribute.String;
  };
}

export interface KansliMember extends Schema.Component {
  collectionName: 'components_kansli_members';
  info: {
    displayName: 'Member';
    description: '';
  };
  attributes: {
    fornamn: Attribute.String;
    efternamn: Attribute.String;
    roll: Attribute.String;
    profilbild: Attribute.Media;
  };
}

export interface LandslagResultatResultat extends Schema.Component {
  collectionName: 'components_landslag_resultat_resultats';
  info: {
    displayName: 'resultat';
    description: '';
  };
  attributes: {
    match: Attribute.String;
    resultat: Attribute.String;
    resultlink: Attribute.String;
    bild: Attribute.Media;
  };
}

export interface PlayersPlayer extends Schema.Component {
  collectionName: 'components_players_players';
  info: {
    displayName: 'player';
    description: '';
  };
  attributes: {
    fornamn: Attribute.String;
    roll: Attribute.String;
    smeknamn: Attribute.String;
    bild: Attribute.Media;
    efternamn: Attribute.String;
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
