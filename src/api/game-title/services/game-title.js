'use strict';

/**
 * game-title service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-title.game-title');
