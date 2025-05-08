module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
    'strapi-plugin-populate-deep': {
      config: {
        defaultDepth: 5, // Default is 5
      }
    },
    "strapi-plugin-slate": {
      
    }
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  oembed: {
    enabled: true,
  },
});