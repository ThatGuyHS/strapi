import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    singularName: 'article';
    pluralName: 'articles';
    displayName: '/nyheter & /projekt';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titel: Attribute.String;
    thumbnail: Attribute.Media;
    thumbnailText: Attribute.String;
    sektion_2_titel: Attribute.String;
    sektion_2_bild: Attribute.Media;
    sektion_2_bild_text: Attribute.Text;
    publiceringsmanad: Attribute.String;
    slug: Attribute.String;
    projektArtikel: Attribute.Boolean;
    vikt: Attribute.Integer;
    sektion_1_text: Attribute.Blocks;
    sektion_2_text: Attribute.Blocks;
    avslutatProjekt: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCalendareventCalendarevent extends Schema.CollectionType {
  collectionName: 'calendarevents';
  info: {
    singularName: 'calendarevent';
    pluralName: 'calendarevents';
    displayName: '/kalender';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    datum: Attribute.DateTime;
    titel: Attribute.String;
    beskrivning: Attribute.Text;
    link: Attribute.String;
    thumbnail: Attribute.Media;
    linktext: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::calendarevent.calendarevent',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::calendarevent.calendarevent',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForbundetinfoForbundetinfo extends Schema.CollectionType {
  collectionName: 'forbundetinfos';
  info: {
    singularName: 'forbundetinfo';
    pluralName: 'forbundetinfos';
    displayName: '/forbundet';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    headerbild: Attribute.Media;
    titel: Attribute.String;
    sektion_2_titel: Attribute.String;
    sektion_2_bild: Attribute.Media;
    kansliet_titel: Attribute.String;
    kanslimedlem: Attribute.Component<'kansli.member', true>;
    styrelsemedlem: Attribute.Component<'kansli.member', true>;
    arsmotehandling: Attribute.Component<'handling.arsmoeteshandling', true>;
    styrelsemoteprotokoll: Attribute.Component<
      'handling.arsmoeteshandling',
      true
    >;
    sektion_1_bild: Attribute.Media;
    sektion_1_titel: Attribute.String;
    styrelsen_titel: Attribute.String;
    sektion_1_text: Attribute.Blocks;
    sektion_2_text: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::forbundetinfo.forbundetinfo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::forbundetinfo.forbundetinfo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForeningForening extends Schema.CollectionType {
  collectionName: 'forenings';
  info: {
    singularName: 'forening';
    pluralName: 'forenings';
    displayName: '/foreningar';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    namn: Attribute.String;
    beskrivning: Attribute.Text;
    webbsidelank: Attribute.String;
    thumbnail: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::forening.forening',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::forening.forening',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGameTitleGameTitle extends Schema.CollectionType {
  collectionName: 'game_titles';
  info: {
    singularName: 'game-title';
    pluralName: 'game-titles';
    displayName: '/esport/grentitlar';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    titel: Attribute.String;
    thumbnail: Attribute.Media;
    thumbnailText: Attribute.String;
    sektion_1_titel: Attribute.String;
    sektion_1_bild: Attribute.Media;
    sektion_2_titel: Attribute.String;
    sektion_2_bild: Attribute.Media;
    section_2_bild_text: Attribute.Text;
    slug: Attribute.String;
    regelverk_2_titel: Attribute.String;
    regelverk_1_link: Attribute.String;
    regelverk_1_titel: Attribute.String;
    regelverk_3_titel: Attribute.String;
    regelverk_3_link: Attribute.String;
    regelverk_2_link: Attribute.String;
    sektion_1_text: Attribute.Blocks;
    sektion_2_text: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::game-title.game-title',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::game-title.game-title',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHistoriaHistoria extends Schema.CollectionType {
  collectionName: 'historias';
  info: {
    singularName: 'historia';
    pluralName: 'historias';
    displayName: '/historia';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    headerbild: Attribute.Media;
    titel: Attribute.String;
    sektion_1_text: Attribute.Blocks;
    sektion_2_titel: Attribute.String;
    sektion_2_bild: Attribute.Media;
    sektion_2_text: Attribute.Blocks;
    sektion_3_titel: Attribute.String;
    sektion_3_text: Attribute.Blocks;
    sektion_3_bild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::historia.historia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::historia.historia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHowBecomeMemberHowBecomeMember
  extends Schema.CollectionType {
  collectionName: 'how_become_members';
  info: {
    singularName: 'how-become-member';
    pluralName: 'how-become-members';
    displayName: 'HowBecomeMember';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titel: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::how-become-member.how-become-member',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::how-become-member.how-become-member',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLandingPageLandingPage extends Schema.CollectionType {
  collectionName: 'landing_pages';
  info: {
    singularName: 'landing-page';
    pluralName: 'landing-pages';
    displayName: 'landing-page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    headertitel: Attribute.String;
    headerbild: Attribute.Media;
    sektion_1_titel: Attribute.String;
    sektion_1_text: Attribute.Blocks;
    sektion_2_titel: Attribute.String;
    sektion_2_text: Attribute.Blocks;
    sektion_2_bild: Attribute.Media;
    sektion_3_titel: Attribute.String;
    sektion_3_text: Attribute.Blocks;
    sponsorer: Attribute.Media;
    sektion_3_bild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::landing-page.landing-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::landing-page.landing-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNationalTeamNationalTeam extends Schema.CollectionType {
  collectionName: 'national_teams';
  info: {
    singularName: 'national-team';
    pluralName: 'national-teams';
    displayName: '/landslagen';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    namn: Attribute.String;
    beskrivning: Attribute.Text;
    spelare: Attribute.Component<'players.player'>;
    lagbild: Attribute.Media;
    spelare2: Attribute.Component<'players.player', true>;
    spelare3: Attribute.Component<'players.player', true>;
    spelare4: Attribute.Component<'players.player', true>;
    spelare5: Attribute.Component<'players.player', true>;
    coach: Attribute.Component<'players.player', true>;
    resultat: Attribute.Component<'landslag-resultat.resultat', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::national-team.national-team',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::national-team.national-team',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNavbarItemNavbarItem extends Schema.CollectionType {
  collectionName: 'navbar_items';
  info: {
    singularName: 'navbar-item';
    pluralName: 'navbar-items';
    displayName: 'navbar-item';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    dropdownitem: Attribute.Component<'dropdown-item.navigation', true>;
    headertitle: Attribute.String;
    order: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    harDropdown: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::navbar-item.navbar-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::navbar-item.navbar-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNordiskamasterskapenNordiskamasterskapen
  extends Schema.CollectionType {
  collectionName: 'nordiskamasterskapens';
  info: {
    singularName: 'nordiskamasterskapen';
    pluralName: 'nordiskamasterskapens';
    displayName: '/nordiskamasterskapen';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titel: Attribute.String;
    thumbnail: Attribute.Media;
    thumbnailText: Attribute.String;
    sektion_1_titel: Attribute.String;
    sektion_1_text: Attribute.Text;
    sektion_1_bild: Attribute.Media;
    sektion_2_titel: Attribute.String;
    sektion_2_text: Attribute.Text;
    sektion_2_bild: Attribute.Media;
    sektion_2_bild_text: Attribute.String;
    publiceringsmanad: Attribute.String;
    slug: Attribute.String;
    projektartikel: Attribute.Boolean;
    vikt: Attribute.Integer;
    sektion_3_text: Attribute.Text;
    sektion_3_bild: Attribute.Media;
    sektion_4_text: Attribute.Text;
    sektion_4_bild: Attribute.Media;
    sektion_3_titel: Attribute.String;
    sektion_4_titel: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nordiskamasterskapen.nordiskamasterskapen',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::nordiskamasterskapen.nordiskamasterskapen',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNordiskamasterskapenEnNordiskamasterskapenEn
  extends Schema.CollectionType {
  collectionName: 'nordiskamasterskapen_ens';
  info: {
    singularName: 'nordiskamasterskapen-en';
    pluralName: 'nordiskamasterskapen-ens';
    displayName: '/nordiskamasterskapen/en';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titel: Attribute.String;
    thumbnail: Attribute.Media;
    thumbnailText: Attribute.String;
    sektion_1_titel: Attribute.String;
    sektion_1_text: Attribute.Text;
    sektion_1_bild: Attribute.Media;
    sektion_2_titel: Attribute.String;
    sektion_2_text: Attribute.Text;
    publiceringsmanad: Attribute.String;
    slug: Attribute.String;
    projektartikel: Attribute.Boolean;
    vikt: Attribute.Integer;
    sektion_3_titel: Attribute.String;
    sektion_3_text: Attribute.Text;
    sektion_3_bild: Attribute.Media;
    sektion_4_text: Attribute.Text;
    sektion_4_bild: Attribute.Media;
    sektion_4_titel: Attribute.String;
    sektion_2_bild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nordiskamasterskapen-en.nordiskamasterskapen-en',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::nordiskamasterskapen-en.nordiskamasterskapen-en',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlayerPlayer extends Schema.CollectionType {
  collectionName: 'players';
  info: {
    singularName: 'player';
    pluralName: 'players';
    displayName: '/landslagen - spelare';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    fornamn: Attribute.String;
    smeknamn: Attribute.String;
    efternamn: Attribute.String;
    spel: Attribute.String;
    alder: Attribute.String;
    rank: Attribute.String;
    stad: Attribute.String;
    biografi: Attribute.Text;
    bild: Attribute.Media;
    headerbild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::player.player',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::player.player',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSidaSida extends Schema.CollectionType {
  collectionName: 'sidas';
  info: {
    singularName: 'sida';
    pluralName: 'sidas';
    displayName: 'sida';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Sida: Attribute.DynamicZone<
      ['titel.titel', 'mainbild.mainbild', 'url.url-svenskesport-se']
    >;
    layout: Attribute.Enumeration<
      [
        'titel, headerbild, leftaligned text (anbud) ',
        'headerbild (med titel), 3 stycken text (historia) ',
        'headerbild, textstycken (bild t h\u00F6ger/v\u00E4nster)'
      ]
    >;
    sektion_1_text: Attribute.Blocks;
    sektion_2_titel: Attribute.String;
    sektion_2_text: Attribute.Blocks;
    sektion_3_titel: Attribute.String;
    sektion_3_text: Attribute.Blocks;
    sektion_2_bild: Attribute.Media;
    sektion_3_bild: Attribute.Media;
    datum: Attribute.String;
    huvudtext: Attribute.Blocks;
    sektion_4_text: Attribute.Blocks;
    sektion_4_bild: Attribute.Media;
    sektion_1_bild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::sida.sida', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::sida.sida', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiSponsorerSponsorer extends Schema.CollectionType {
  collectionName: 'sponsorers';
  info: {
    singularName: 'sponsorer';
    pluralName: 'sponsorers';
    displayName: '/sponsorer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    namn: Attribute.String;
    beskrivning: Attribute.Blocks;
    webbsidelank: Attribute.String;
    bild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sponsorer.sponsorer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sponsorer.sponsorer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTjansterTjanster extends Schema.CollectionType {
  collectionName: 'tjansters';
  info: {
    singularName: 'tjanster';
    pluralName: 'tjansters';
    displayName: 'tjanster';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    lank: Attribute.String;
    beskrivning: Attribute.Text;
    content: Attribute.Blocks;
    jobbtyp: Attribute.String;
    plats: Attribute.String;
    deadline: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tjanster.tjanster',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tjanster.tjanster',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTjansterbeskrivningTjansterbeskrivning
  extends Schema.CollectionType {
  collectionName: 'tjansterbeskrivnings';
  info: {
    singularName: 'tjansterbeskrivning';
    pluralName: 'tjansterbeskrivnings';
    displayName: 'tjansterbeskrivning';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titel: Attribute.String;
    bild: Attribute.Media;
    text: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tjansterbeskrivning.tjansterbeskrivning',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tjansterbeskrivning.tjansterbeskrivning',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWhyBecomeMemberWhyBecomeMember
  extends Schema.CollectionType {
  collectionName: 'why_become_members';
  info: {
    singularName: 'why-become-member';
    pluralName: 'why-become-members';
    displayName: '/bli-medlem';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titel: Attribute.String;
    headerbild: Attribute.Media;
    sektion_1_titel: Attribute.String;
    sektion_1_text: Attribute.Blocks;
    sektion_2_titel: Attribute.String;
    sektion_2_bild: Attribute.Media;
    sektion_2_text: Attribute.Blocks;
    sektion_3_titel: Attribute.String;
    sektion_3_text: Attribute.Blocks;
    sektion_3_bild: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::why-become-member.why-become-member',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::why-become-member.why-become-member',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::article.article': ApiArticleArticle;
      'api::calendarevent.calendarevent': ApiCalendareventCalendarevent;
      'api::forbundetinfo.forbundetinfo': ApiForbundetinfoForbundetinfo;
      'api::forening.forening': ApiForeningForening;
      'api::game-title.game-title': ApiGameTitleGameTitle;
      'api::historia.historia': ApiHistoriaHistoria;
      'api::how-become-member.how-become-member': ApiHowBecomeMemberHowBecomeMember;
      'api::landing-page.landing-page': ApiLandingPageLandingPage;
      'api::national-team.national-team': ApiNationalTeamNationalTeam;
      'api::navbar-item.navbar-item': ApiNavbarItemNavbarItem;
      'api::nordiskamasterskapen.nordiskamasterskapen': ApiNordiskamasterskapenNordiskamasterskapen;
      'api::nordiskamasterskapen-en.nordiskamasterskapen-en': ApiNordiskamasterskapenEnNordiskamasterskapenEn;
      'api::player.player': ApiPlayerPlayer;
      'api::sida.sida': ApiSidaSida;
      'api::sponsorer.sponsorer': ApiSponsorerSponsorer;
      'api::tjanster.tjanster': ApiTjansterTjanster;
      'api::tjansterbeskrivning.tjansterbeskrivning': ApiTjansterbeskrivningTjansterbeskrivning;
      'api::why-become-member.why-become-member': ApiWhyBecomeMemberWhyBecomeMember;
    }
  }
}
