const sails = require('sails');
const seed = require('../seeds/test/seed');

// Before running any tests...
before(function (done) {
  this.timeout(10000);

  sails.lift(
    {
      // Your Sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.

      // For example, we might want to skip the Grunt hook,
      // and disable all logs except errors and warnings:
      hooks: { grunt: false },
      log: { level: 'warn' },
    },
    async (err) => {
      if (err) {
        return done(err);
      }
      // here you can load fixtures, etc.
      // (for example, you might want to create some records in the database)

      await seed.up();
      return done();
    },
  );
});

// After all tests have finished...
after(() => {
  // here you can clear fixtures, etc.
  // (e.g. you might want to destroy the records you created above)
  seed.down();
  sails.lower(() => {
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  });
});
