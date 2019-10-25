const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');
const { UnableToSendEmailException } = require('../exceptions');

const {
  EMAIL_ID, EMAIL_PASS, BASE_URL, CMS_PORT,
} = sails.config.custom;

const getHeaderFromSchema = function (schema, header = []) {
  try {
    const { components } = schema;
    for (const {
      input, key, label, columns,
    } of components) {
      // eslint-disable-next-line no-continue
      if (label === 'Submit') continue;
      if (input) {
        header.push({ id: key, title: label });
      } else {
        columns.forEach((column) => {
          getHeaderFromSchema(column, header);
        });
      }
    }
    return header;
  } catch (error) {
    throw error;
  }
};

const sendMail = async function (message) {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(
      `smtps://${EMAIL_ID}:${EMAIL_PASS}@smtp.gmail.com`,
    );

    // setup e-mail data with unicode symbols
    const mailOptions = {
      from: `"Indus Action Tech Support" <${EMAIL_ID}>`, // sender email
      ...message,
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new UnableToSendEmailException(error.message, message.to);
  }
};

const prepTasksReport = async function prepareReportForDownload(
  {
    data: {
      end = Date.now(),
      start = end - 7 * 24 * 60 * 60 * 1000,
      filter = {},
      user,
      email = user,
    },
  },
  cb,
) {
  try {
    let filterQuery = '';
    const header = [
      { id: 'created_at', title: 'Created At' },
      { id: 'updated_at', title: 'Updated At' },
      { id: 'task_type_name', title: 'Task Type' },
      { id: 'task_status_name', title: 'Task Status' },
      { id: 'assignee_mobile', title: 'Assignee Mobile' },
      { id: 'assignee_email', title: 'Assignee Email' },
      { id: 'beneficiary_mobile', title: 'Beneficiary Moblie' },
      { id: 'state_name', title: 'State' },
    ];
    const timeStamp = Math.floor(new Date() / 1000);
    fileName = `${user}_${timeStamp}`;
    const path = `./reports/task/${fileName}.csv`;
    const csvWriter = await createCsvWriter({
      path,
      header,
    });

    for (const [key, value] of Object.entries(filter)) {
      filterQuery += `${key}_id = '${value}' AND `;
    }

    const query = `
      SELECT created_at, updated_at, task_type_name, 
      task_status_name, assignee_mobile, assignee_email, 
      beneficiary_mobile, state_name
      FROM tasks_view
      WHERE 
        ${filterQuery} 
        ((ROUND(EXTRACT(EPOCH FROM updated_at)::numeric, 5)*1000) < ${new Date(end).getTime()} 
        AND (ROUND(EXTRACT(EPOCH FROM updated_at)::numeric, 5)*1000) > ${new Date(
          start,
  ).getTime()});
    `;
    const tasks = (await sails.sendNativeQuery(query, [])).rows;

    await csvWriter.writeRecords(tasks).then(async () => {
      message = {
        to: email,
        subject: 'Tasks Report Download',
        text: `Hi,
        Your requested tasks report is ready for download. Click the link below.
        ${BASE_URL}:${CMS_PORT}/tasks/download?task=${fileName}`,
      };
      await sendMail(message);
    });

    return cb();
  } catch (error) {
    sails.log.error(error);
    return 0;
  }
};

const prepFormReport = async function prepareFormReportForDownload(
  {
    data: {
      end = Date.now(),
      start = end - 7 * 24 * 60 * 60 * 1000,
      filter: { form, owner = '' },
      user,
      email = user,
    },
  },
  cb,
) {
  try {
    schema = await Forms.findOne({ id: form });
    header = await getHeaderFromSchema(schema);

    const timeStamp = Math.floor(new Date() / 1000);
    fileName = `${user}_${timeStamp}`;
    const path = `./reports/form/${fileName}.csv`;
    const csvWriter = await createCsvWriter({
      path,
      header,
    });
    const data = (await Submissions.find({
      owner: { contains: owner },
      form,
      updated_at: { '>': new Date(start), '<': new Date(end) },
    })).map(submission => submission.data);
    await csvWriter.writeRecords(data).then(async () => {
      message = {
        to: email,
        subject: 'Form Report Download',
        text: `Hi,
        Your requested form report is ready for download. Click the link below.
        ${BASE_URL}:${CMS_PORT}/tasks/download?form=${fileName}`,
      };
      await sendMail(message);
    });

    return cb();
  } catch (error) {
    sails.log.error(error);
    return 0;
  }
};

exports._processors = {
  prepTasksReport,
  prepFormReport,
};
