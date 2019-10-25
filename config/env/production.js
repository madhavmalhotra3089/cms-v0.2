module.exports = {
  datastores: {
    default: {},
  },

  models: {
    migrate: 'safe',
  },

  blueprints: {
    shortcuts: false,
  },

  security: {
    cors: {},
  },

  session: {
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  },

  sockets: {},

  log: {
    level: 'debug',
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000,
  },

  custom: {
    JWT_SECRET_KEY: 'P%zQzV/7yEmGm(j]+eTiHv+M@}LyN,',
    SMS_SECRET_KEY: '212223Ap6yiNtk5ae06695',
    BASE_URL: 'http://13.233.162.223',
    CMS_PORT: '1337',
    FORMIO_PORT: '9001',
    FORMIO_EMAIL: 'itsupport@indusaction.org',
    FORMIO_PASSWORD: 'admin123',
  },
};
