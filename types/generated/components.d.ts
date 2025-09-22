import type { Schema, Attribute } from '@strapi/strapi';

export interface AnnatAnnat extends Schema.Component {
  collectionName: 'components_annat_annats';
  info: {
    displayName: 'Annat';
  };
  attributes: {
    namn: Attribute.String;
    link: Attribute.String;
  };
}

export interface BracketInfoBracketInfo extends Schema.Component {
  collectionName: 'components_bracket_info_bracket_infos';
  info: {
    displayName: 'bracket-info';
    description: 'Bracket information component';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Blocks;
    link: Attribute.String & Attribute.Required;
    game_title: Attribute.String;
    type: Attribute.Enumeration<['bracket', 'standings', 'schedule', 'stream']>;
    is_live: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface CtaCta extends Schema.Component {
  collectionName: 'components_cta_ctas';
  info: {
    displayName: 'cta';
  };
  attributes: {
    ctatext: Attribute.String;
    link: Attribute.String;
  };
}

export interface DropdownItemNavigation extends Schema.Component {
  collectionName: 'components_dropdown_item_navigations';
  info: {
    displayName: 'dropdownitem';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
    order: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface EventPlayerPlayer extends Schema.Component {
  collectionName: 'components_event_player_players';
  info: {
    displayName: 'player';
    description: 'Player component for events';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    nickname: Attribute.String;
    role: Attribute.String;
  };
}

export interface ExhibitorExhibitor extends Schema.Component {
  collectionName: 'components_exhibitor_exhibitors';
  info: {
    displayName: 'exhibitor';
    description: 'Exhibitor component';
  };
  attributes: {
    namn: Attribute.String & Attribute.Required;
    beskrivning: Attribute.Blocks;
    webbsidelank: Attribute.String;
    thumbnail: Attribute.Media;
    booth_number: Attribute.String;
    category: Attribute.String;
  };
}

export interface FortroendevaldFortroendevald extends Schema.Component {
  collectionName: 'components_fortroendevald_fortroendevalds';
  info: {
    displayName: 'fortroendevald';
  };
  attributes: {
    fornamn: Attribute.String;
    efternamn: Attribute.String;
    profilbild: Attribute.Media;
    roll: Attribute.String;
  };
}

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

export interface LayoutLayout extends Schema.Component {
  collectionName: 'components_layout_layouts';
  info: {
    displayName: 'layout';
  };
  attributes: {
    layout: Attribute.Enumeration<['layout1', 'layout2', 'layout3']>;
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

export interface NavigationNavigation extends Schema.Component {
  collectionName: 'components_navigation_navigations';
  info: {
    displayName: 'navigation';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
    order: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
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

export interface ScheduleItemScheduleItem extends Schema.Component {
  collectionName: 'components_schedule_item_schedule_items';
  info: {
    displayName: 'schedule-item';
    description: 'Schedule item component';
  };
  attributes: {
    time: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    description: Attribute.Blocks;
    location: Attribute.String;
  };
}

export interface Sektion2TextSektion2Text extends Schema.Component {
  collectionName: 'components_sektion_2_text_sektion_2_texts';
  info: {
    displayName: 'sektion-2-text';
  };
  attributes: {
    test: Attribute.Blocks;
  };
}

export interface Sektion3BildSektion3Bild extends Schema.Component {
  collectionName: 'components_sektion_3_bild_sektion_3_bilds';
  info: {
    displayName: 'sektion-3-bild';
  };
  attributes: {
    bild: Attribute.Media;
  };
}

export interface Sektion3TextSektion3Text extends Schema.Component {
  collectionName: 'components_sektion_3_text_sektion_3_texts';
  info: {
    displayName: 'sektion-3-text';
  };
  attributes: {
    sektionstext: Attribute.Blocks;
  };
}

export interface Sektion4TextSektion4Text extends Schema.Component {
  collectionName: 'components_sektion_4_text_sektion_4_texts';
  info: {
    displayName: 'sektion-4-text';
  };
  attributes: {
    sektion4text: Attribute.Blocks;
  };
}

export interface Sektion4BildSektion4Bild extends Schema.Component {
  collectionName: 'components_sektion4bild_sektion4bilds';
  info: {
    displayName: 'sektion4bild';
  };
  attributes: {
    bild: Attribute.Media;
  };
}

export interface SektionstextSektion2Text extends Schema.Component {
  collectionName: 'components_sektionstext_sektion_2_texts';
  info: {
    displayName: 'sektion-2-text';
  };
  attributes: {
    test: Attribute.Blocks;
  };
}

export interface SektionstextSektionstext extends Schema.Component {
  collectionName: 'components_sektionstext_sektionstexts';
  info: {
    displayName: 'sektionstext';
  };
  attributes: {
    sektionstext: Attribute.Blocks;
  };
}

export interface SocialMediaSocialMedia extends Schema.Component {
  collectionName: 'components_social_media_social_medias';
  info: {
    displayName: 'social-media';
    description: 'Social media links component';
  };
  attributes: {
    twitter: Attribute.String;
    instagram: Attribute.String;
    twitch: Attribute.String;
  };
}

export interface StadgarStadgar extends Schema.Component {
  collectionName: 'components_stadgar_stadgars';
  info: {
    displayName: 'Annat';
    description: '';
  };
  attributes: {
    namn: Attribute.String;
    link: Attribute.String;
  };
}

export interface TeamTeam extends Schema.Component {
  collectionName: 'components_team_teams';
  info: {
    displayName: 'team';
    description: 'Team component';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    beskrivning: Attribute.Blocks;
    logo: Attribute.Media;
    captain: Attribute.String;
    region: Attribute.String;
    game_title: Attribute.String;
    website: Attribute.String;
    social_media: Attribute.Component<'social-media.social-media'>;
    players: Attribute.Component<'event-player.player', true>;
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

export interface UrlUrlSvenskesportSe extends Schema.Component {
  collectionName: 'components_url_url_svenskesport_se_s';
  info: {
    displayName: 'URL (svenskesport.se/)';
  };
  attributes: {
    url: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'annat.annat': AnnatAnnat;
      'bracket-info.bracket-info': BracketInfoBracketInfo;
      'cta.cta': CtaCta;
      'dropdown-item.navigation': DropdownItemNavigation;
      'event-player.player': EventPlayerPlayer;
      'exhibitor.exhibitor': ExhibitorExhibitor;
      'fortroendevald.fortroendevald': FortroendevaldFortroendevald;
      'handling.arsmoeteshandling': HandlingArsmoeteshandling;
      'kansli.member': KansliMember;
      'landslag-resultat.resultat': LandslagResultatResultat;
      'layout.layout': LayoutLayout;
      'mainbild.mainbild': MainbildMainbild;
      'navigation.navigation': NavigationNavigation;
      'players.player': PlayersPlayer;
      'schedule-item.schedule-item': ScheduleItemScheduleItem;
      'sektion-2-text.sektion-2-text': Sektion2TextSektion2Text;
      'sektion-3-bild.sektion-3-bild': Sektion3BildSektion3Bild;
      'sektion-3-text.sektion-3-text': Sektion3TextSektion3Text;
      'sektion-4-text.sektion-4-text': Sektion4TextSektion4Text;
      'sektion4bild.sektion4bild': Sektion4BildSektion4Bild;
      'sektionstext.sektion-2-text': SektionstextSektion2Text;
      'sektionstext.sektionstext': SektionstextSektionstext;
      'social-media.social-media': SocialMediaSocialMedia;
      'stadgar.stadgar': StadgarStadgar;
      'team.team': TeamTeam;
      'titel.titel': TitelTitel;
      'url.url-svenskesport-se': UrlUrlSvenskesportSe;
    }
  }
}
