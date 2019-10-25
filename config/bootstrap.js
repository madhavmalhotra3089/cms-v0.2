/* const kue = require('kue-scheduler');

const task = './reports/task';
const form = './reports/form';
const fs = require('fs');
const { CleanupException } = require('../api/exceptions');

exports.bootstrap = function (cb) {
  const Queue = kue.createQueue();

  // perform cleanup
  Queue.remove(
    {
      unique: 'cleanup',
    },
    (error, response) => {
      sails.log.info(response);
    },
  );

  // processing jobs
  Queue.process('cleanup', (job, done) => {
    // put in try catch block
    try {
      sails.log.info('Processing job with id %s at %s', job.id, new Date().toString());
      currentTime = Math.floor(new Date() / 1000);
      fs.readdirSync(task).forEach((file) => {
        time = Number(file.split('_')[1].split('.')[0]);
        if (currentTime - time > 24 * 60 * 60) {
          fs.unlink(`${task}/${file}`, (err) => {
            if (err) throw new CleanupException(err.message, `${task}/${file}`);
            fs.appendFile(
              './reports/success.log',
              `${new Date(currentTime * 1000).toString()}:: Deleted task/${file}\n`,
              (err2) => {
                if (err2) throw new Error('logging error');
              },
            );
          });
        }
      });
      fs.readdirSync(form).forEach((file) => {
        time = Number(file.split('_')[1].split('.')[0]);
        if (currentTime - time > 24 * 60 * 60) {
          fs.unlink(`${form}/${file}`, (err) => {
            if (err) throw new CleanupException(err.message, `${form}/${file}`);
            fs.appendFile(
              './reports/success.log',
              `${new Date(currentTime * 1000).toString()}:: Deleted form/${file}\n`,
              (err2) => {
                if (err2) throw new Error('logging error');
              },
            );
          });
        }
      });
      return done(null, { deliveredAt: new Date() });
    } catch (error) {
      fs.writeFile(
        './reports/fail.log',
        `${new Date(
          currentTime * 1000,
        ).toString()}:: Deletion failed task/${file} with ${err.toString()}\n`,
        (err2) => {
          sails.log.error(`logging error ${err2}`);
        },
      );
      sails.log.error(error);
      return done(null, { deliveredAt: new Date() });
    }
  });

  // listen on scheduler errors
  Queue.on('schedule error', (error) => {
    // handle all scheduling errors here
    sails.log.error(error);
  });

  // listen on success scheduling
  Queue.on('schedule success', (job) => {
    // a highly recommended place to attach
    // job instance level events listeners
    job
      .on('complete', (result) => {
        sails.log.info('Job completed with data ', result); // write to success log
      })
      .on('failed attempt', (errorMessage, doneAttempts) => {
        sails.log.warn(`Job failed ${doneAttempts} time(s) with ${errorMessage}`); // do nothing
      })
      .on('failed', (errorMessage) => {
        sails.log.error(`Job failed with ${errorMessage}`); // write to fail log
      })
      .on('progress', (progress, data) => {
        sails.log.info(`\r  job #${job.id} ${progress}% complete with data `, data); // do nothing
      });
  });

  // prepare a job to perform
  // dont save it
  const job = Queue.createJob('cleanup', { to: 'any' })
    .attempts(3)
    .backoff({ delay: 60000, type: 'fixed' })
    .priority('normal')
    .unique('cleanup');

  // schedule a job then
  Queue.every('0 0 * * *', job);
  cb();
};
 */
