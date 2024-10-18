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

export interface MainbildMainbild extends Schema.Component {
  collectionName: 'components_mainbild_mainbilds';
  info: {
    displayName: 'mainbild';
    icon: 'archive';
  };
  attributes: {
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

export interface SektionstextSektionstext extends Schema.Component {
  collectionName: 'components_sektionstext_sektionstexts';
  info: {
    displayName: 'sektionstext';
    icon: 'filter';
  };
  attributes: {
    text: Attribute.Blocks;
  };
}

export interface TitelTitel extends Schema.Component {
  collectionName: 'components_titel_titels';
  info: {
    displayName: 'Titel';
    icon: 'alien';
  };
  attributes: {
    titel: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'handling.arsmoeteshandling': HandlingArsmoeteshandling;
      'kansli.member': KansliMember;
      'landslag-resultat.resultat': LandslagResultatResultat;
      'mainbild.mainbild': MainbildMainbild;
      'players.player': PlayersPlayer;
      'sektionstext.sektionstext': SektionstextSektionstext;
      'titel.titel': TitelTitel;
    }
  }
}
