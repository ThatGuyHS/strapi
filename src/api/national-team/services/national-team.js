'use strict';

/**
 * national-team service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::national-team.national-team');
