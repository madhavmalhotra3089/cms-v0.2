const seedUser = knex => knex('users')
    .then(() => knex('users').insert([
      {
        name: 'admin',
        email: 'itsupport@indusaction.org',
        mobile: '9999999999',
        password: '$2a$10$XXkscWYOcSog0KUD90VFFelKv12B9JXnE9uLgD8eJ590cZqKSG9j6',
        config: {
          featureConfig: [
            {
              state: '',
              features: [
                {
                  featureId: '',
                  permissions: [],
                },
              ],
            },
            {
              state: '',
              features: [
                {
                  featureId: '',
                  permissions: [],
                },
              ],
            },
          ],
        },
      },
    ]))
    .catch(() => {});
exports.seed = seedUser;
