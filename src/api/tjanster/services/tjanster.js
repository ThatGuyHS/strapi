'use strict';

/**
 * tjanster service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tjanster.tjanster');
