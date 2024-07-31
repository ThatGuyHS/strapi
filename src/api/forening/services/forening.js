'use strict';

/**
 * forening service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::forening.forening');
