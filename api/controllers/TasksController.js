const { begin, error, end } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { validateRequest } = sails.helpers.validation.http;
const { filterTasks, taskBulkAssign, count } = sails.helpers.models.tasks;
const {
  modelCreate,
  modelFetchOne,
  modelEnableDisable,
  modelRecordNotExists,
  modelRecordAlreadyExists,
  modelUpdate,
} = sails.helpers.models.crud;

const {
  Create,
  Delete,
  FetchOne,
  FetchAll,
  Update,
  BulkAssign,
  TaskQuery,
  Sync,
} = require('./TaskSchema');
const reportDownloadSchema = require('../schemas/ReportDownload');

const {
  getToken,
  requests: { post, put },
  submissions: { prepareUrl },
} = sails.helpers.formio;

const {
  formio: { URL_FORM },
} = sails.config.custom.CONSTANTS;

const config = async function (req, res) {
  try {
    return res.ok(sails.i18n.ok);
  } catch (err) {
    return res.badRequest(err);
  }
};

const create = async function (req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // get request body
    const request = req.allParams();
    // validate the parameters
    // Get the model objects
    const validatedRequest = await validateRequest({
      body: request,
      schema: Create.schema,
    });
    const Task = await Tasks;
    const Type = await Task_type;
    const Status = await Tasks_status;
    const User = await Users;
    const Beneficiary = await Beneficiaries;
    const State = await States;

    await modelRecordNotExists({
      Model: Status,
      name: 'Task Status',
      data: {
        id: validatedRequest.status,
      },
    });
    if ('assignee' in validatedRequest) {
      await modelRecordNotExists({
        Model: User,
        name: 'Assignee',
        data: {
          id: validatedRequest.assignee,
        },
      });
    }
    await modelRecordNotExists({
      Model: Beneficiary,
      name: 'Beneficiary',
      data: {
        id: validatedRequest.beneficiary,
      },
    });
    await modelRecordNotExists({
      Model: Type,
      name: 'Task Type',
      data: {
        id: validatedRequest.type,
      },
    });
    await modelRecordNotExists({
      Model: State,
      name: 'State',
      data: {
        id: validatedRequest.state,
      },
    });
    await modelRecordNotExists({
      Model: Type,
      name: 'Task Type',
      data: {
        id: validatedRequest.type,
      },
    });
    await modelRecordNotExists({
      Model: State,
      name: 'State',
      data: {
        id: validatedRequest.state,
      },
    });

    // Check if the same beneficiary and type task is allready there
    await modelRecordAlreadyExists({
      Model: Task,
      name: 'Task',
      data: {
        type: validatedRequest.type,
        beneficiary: validatedRequest.beneficiary,
      },
    });

    // create Task
    const task = await modelCreate({
      validatedRequest,
      model: Task,
    });
    // event logging: success
    await end(task, event);
    // send response
    return res.ok({
      data: task,
    });
  } catch (err) {
    // event logging: error
    await error(err.toString(), event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json({
      error: err.toString(),
    });
  }
};

const patch = async function updateTaskType(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request data
    const request = {
      ...req.allParams(),
    };
    // validate request
    const validatedRequest = await validateRequest({
      body: request,
      schema: Update.schema,
    });
    const Task = await Tasks;
    const Type = await Task_type;
    const Status = await Tasks_status;
    const User = await Users;
    const Beneficiary = await Beneficiaries;
    const State = await States;
    if ('status' in validatedRequest) {
      await modelRecordNotExists({
        Model: Status,
        name: 'Task Status',
        data: {
          id: validatedRequest.status,
        },
      });
    }
    if ('assignee' in validatedRequest) {
      await modelRecordNotExists({
        Model: User,
        name: 'Assignee',
        data: {
          id: validatedRequest.assignee,
        },
      });
    }
    if ('beneficiary' in validatedRequest) {
      await modelRecordNotExists({
        Model: Beneficiary,
        name: 'Beneficiary',
        data: {
          id: validatedRequest.beneficiary,
        },
      });
    }
    if ('type' in validatedRequest) {
      await modelRecordNotExists({
        Model: Type,
        name: 'Task Type',
        data: {
          id: validatedRequest.type,
        },
      });
    }
    if ('state' in validatedRequest) {
      await modelRecordNotExists({
        Model: State,
        name: 'State',
        data: {
          id: validatedRequest.state,
        },
      });
    }

    if ('type' in validatedRequest && 'beneficiary' in validatedRequest) {
      // Check if the same beneficiary and type task is allready there
      await modelRecordAlreadyExists({
        Model: Task,
        name: 'Task',
        data: {
          type: validatedRequest.type,
          beneficiary: validatedRequest.beneficiary,
        },
      });
    }
    // perform update operation and get response
    const response = await modelUpdate({
      validatedRequest,
      Model: Task,
      name: 'Task',
    });
    // event logging: end
    await end(response, event);
    // return the response
    return res.ok(response);
  } catch (err) {
    // event logging: error
    await error(
      {
        error: err.toString(),
      },
      event,
    );
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send the error response
    return res.status(statusCode).json({
      error: err.toString(),
    });
  }
};
const deleteTask = async function (req, res) {
  let event;
  try {
    event = await begin(req);
    const request = {
      ...req.allParams(),
    };
    const validatedRequest = await validateRequest({
      body: request,
      schema: Delete.schema,
    });
    const Task = await Tasks;
    const response = await modelEnableDisable({
      validatedRequest,
      model: Task,
    });
    await end(
      {
        response,
      },
      event,
    );
    return res.ok(response);
  } catch (err) {
    await error(err, event);
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    return res.json(err.toString());
  }
};

const fetchOne = async function (req, res) {
  let event;
  try {
    event = await begin(req);
    const request = {
      ...req.allParams(),
    };
    const validatedRequest = await validateRequest({
      body: request,
      schema: FetchOne.schema,
    });
    const Task = await Tasks;
    const response = await modelFetchOne({
      validatedRequest,
      model: Task,
    });
    await end(
      {
        ...response,
      },
      event,
    );
    return res.ok({
      data: response,
    });
  } catch (err) {
    await error(err, event);
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    return res.json(err.toString());
  }
};

const fetchAll = async function (req, res) {
  let event;
  try {
    event = await begin(req);

    const request = req.query;
    const validatedRequest = await validateRequest({
      body: request,
      schema: FetchAll.schema,
    });
    const response = await filterTasks(validatedRequest);
    // Fetching the submission values

    await end({ ...response }, event);
    return res.ok({ ...response });
  } catch (err) {
    await error(
      {
        error: err.toString(),
      },
      event,
    );
    const statusCode = await assignHttpStatusCode(err);
    return res.status(statusCode).json({
      error: err.toString(),
    });
  }
};
const sync = async function (req, res) {
  let event;

  try {
    event = await begin(req);
    const request = {
      ...req.allParams(),
    };
    const validatedRequest = await validateRequest({
      body: request,
      schema: Sync.schema,
    });

    const Task = await Tasks;
    const Status = await Tasks_status;
    const Type = await Task_type;
    const Beneficiary = await Beneficiaries;
    const { tasks } = validatedRequest;

    tasks.forEach(async (task) => {
      try {
        if (task.id) {
          const taskObj = await modelFetchOne({
            validatedRequest: task,
            model: Task,
            name: 'Task',
          });
          const taskTypeObj = await modelFetchOne({
            validatedRequest: {
              id: taskObj.type,
            },
            model: Type,
            name: 'Task Type',
          });

          const formID = taskTypeObj.form.formId;

          // Check if the task status has changed
          if (taskObj.status !== task.status) {
            taskStatusObj = await modelFetchOne({
              validatedRequest: {
                id: task.status,
              },
              model: Status,
            });

            await modelUpdate({
              validatedRequest: {
                id: task.id,
                status: taskStatusObj.id,
              },
              Model: Task,
              name: 'Task',
            });
          }

          // retrieve formio token
          const token = await getToken();
          // prepare url
          let url = await prepareUrl(URL_FORM, formID);

          // post data to formio server and get response
          if (task.submission) {
            const response = await post(
              token,
              {
                owner: req.session.user.email || req.session.user.mobile,
                data: {
                  ...task.submission.data,
                },
              },
              url,
            );

            // put the new submission id in Task object and save
            await modelUpdate({
              validatedRequest: {
                id: task.id,
                submission_id: response.data._id,
              },
              Model: Task,
              name: 'Task',
            });
          }
          if (task.pSubmission) {
            const beneficiary = await modelFetchOne({
              validatedRequest: {
                id: taskObj.beneficiary,
              },
              model: Beneficiary,
              name: 'Beneficiary',
            });
            url = await prepareUrl(URL_FORM, beneficiary.config.pFormID);
            const persistentSubmissionResponse = await post(
              token,
              {
                owner: req.session.user.email || req.session.user.mobile,
                data: {
                  ...task.pSubmission.data,
                },
              },
              url,
            );
            beneficiary.config.pSubmissionId = persistentSubmissionResponse.data._id;

            await modelUpdate({
              validatedRequest: {
                id: taskObj.beneficiary,
                config: {
                  ...beneficiary.config,
                },
              },
              Model: Beneficiary,
              name: 'Beneficiaries',
            });
          }
        } else {
          const State = await States;

          const state = await modelFetchOne({
            validatedRequest: {
              id: task.state,
            },
            model: State,
            name: 'State',
          });

          const beneficiaryMobile = task.mobile;
          // Check if the beneficiary allready exits
          const beneficiaries = await Beneficiary.find({
            mobile: beneficiaryMobile,
          });
          let beneficiary = {};
          const token = await getToken();

          // Getting Task Type
          const taskTypeObj = await modelFetchOne({
            validatedRequest: {
              id: task.type,
            },
            model: Type,
            name: 'Task Type',
          });

          const formID = taskTypeObj.form.formId;

          if (beneficiaries.length === 0) {
            const beneficiaryModel = {};
            beneficiaryModel.mobile = beneficiaryMobile;
            beneficiaryModel.state = task.state;
            beneficiaryModel.source = 'Ground Survey';
            beneficiaryModel.config = {};

            beneficiaryModel.config.pFormPath = `${state.name.toLowerCase()}/persistent`;

            // prepare url
            const url = await sails.helpers.formio.forms.prepareUrl(
              URL_FORM,
              `${state.name.toLowerCase()}-persistent`,
            );

            const persistentForm = await sails.helpers.formio.requests.get(token, {}, url);
            beneficiaryModel.config.pFormID = persistentForm._id;
            beneficiary = await modelCreate({
              validatedRequest: {
                ...beneficiaryModel,
              },
              model: Beneficiary,
            });
          } else {
            [beneficiary] = beneficiaries;
          }
          // Make the submissions for form and persistentForm

          if (task.pSubmission) {
            url = await prepareUrl(URL_FORM, beneficiary.config.pFormID);
            const persistentSubmissionResponse = await post(
              token,
              {
                owner: req.session.user.email || req.session.user.mobile,
                data: {
                  ...task.pSubmission.data,
                },
              },
              url,
            );
            beneficiary.config.pSubmissionId = persistentSubmissionResponse.data._id;

            await modelUpdate({
              validatedRequest: {
                id: beneficiary.id,
                config: {
                  ...beneficiary.config,
                },
              },
              Model: Beneficiary,
              name: 'Beneficiaries',
            });
          }

          // Check if the same beneficiary and type task is allready there
          await modelRecordAlreadyExists({
            Model: Task,
            name: 'Task',
            data: {
              type: task.type,
              beneficiary: beneficiary.id,
            },
          });

          let response = {};
          if (task.submission) {
            url = await prepareUrl(URL_FORM, formID);
            response = await post(
              token,
              {
                owner: req.session.user.email || req.session.user.mobile,
                data: {
                  ...task.submission.data,
                },
              },
              url,
            );
          }
          const taskObj = {
            type: task.type,
            state: task.state,
            status: task.status,
            beneficiary: beneficiary.id,
            assignee: task.assignee,
            submission_id: response.data ? response.data._id : '',
          };

          await modelCreate({
            validatedRequest: taskObj,
            model: Task,
          });
        }
      } catch (err) {
        await error(
          {
            error: err.toString(),
          },
          event,
        );
      }
    });

    return res.ok({
      status: 'ok',
    });
  } catch (err) {
    await error(
      {
        error: err.toString(),
      },
      event,
    );
    const statusCode = await assignHttpStatusCode(err);
    return res.status(statusCode).json({
      error: err.toString(),
    });
  }
};

const prepTaskReport = async function (req, res) {
  // declare event variable
  let event;
  try {
    // initialize the event
    event = await begin(req);
    // get all request parameters
    const request = { ...req.allParams() };
    // validated request parameters
    const validatedRequest = await validateRequest({
      body: request,
      schema: reportDownloadSchema.tasks,
    });
    // get user email from session
    const user = req.session.user.email;
    // schedule job
    Jobs.create('prepTasksReport', {
      user,
      ...validatedRequest,
    }).save((err) => {
      if (err) throw err;
    });
    const response = `Request processed successfully. CSV shall be sent to ${user} shortly.`;
    // event log: end
    await end({ response }, event);
    // response message
    return res.ok({
      message: `Request processed successfully. CSV shall be sent to ${validatedRequest.email
        || req.session.user.email} shortly.`,
    });
  } catch (err) {
    // event log: error
    await error({ error: err.toString() }, event);
    // assign http status code according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const prepFormReport = async function (req, res) {
  // declare event variable
  let event;
  try {
    // initialize the event
    event = await begin(req);
    // get all request parameters
    const request = { ...req.allParams() };
    // validated request parameters
    const validatedRequest = await validateRequest({
      body: request,
      schema: reportDownloadSchema.forms,
    });
    // get user email from session
    const { email: user } = req.session.user;
    // schedule job
    Jobs.create('prepFormReport', {
      user,
      ...validatedRequest,
    }).save((err) => {
      if (err) throw err;
    });
    const response = `Request processed successfully. CSV shall be sent to ${user} shortly.`;
    // event log: end
    await end({ response }, event);
    // response message
    return res.ok({
      message: `Request processed successfully. CSV shall be sent to ${validatedRequest.email
        || req.session.user.email} shortly.`,
    });
  } catch (err) {
    // event log: error
    await error({ error: err.toString() }, event);
    // assign http status code according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const download = async function (req, res) {
  // declare event variable
  let event;
  try {
    // initialize the event
    event = await begin(req);
    // get all request parameters
    const request = { ...req.query };
    // validated request parameters
    const validatedRequest = await validateRequest({
      body: request,
      schema: reportDownloadSchema.download,
    });
    const key = Object.keys(validatedRequest)[0];
    // download file path
    const path = `./reports/${key}/${validatedRequest[key]}.csv`;
    // event log: end
    await end({ ...path }, event);
    return res.download(path, `${key}-report.csv`);
  } catch (err) {
    // event log: error
    await error({ error: err.toString() }, event);
    // assign http status code according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const patchTask = async function bulkAssignTask(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request data
    const request = {
      ...req.allParams(),
    };
    // validate request

    const validatedRequest = await validateRequest({
      body: request,
      schema: BulkAssign.schema,
    });

    // perform update operation and get response
    const response = await taskBulkAssign(validatedRequest);

    // event logging: end
    await end(response, event);
    // return the response
    return res.ok(response);
  } catch (err) {
    // event logging: error
    await error(
      {
        error: err.toString(),
      },
      event,
    );
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send the error response
    return res.status(statusCode).json({
      error: err.toString(),
    });
  }
};

const taskCount = async function (req, res) {
  let event;
  try {
    event = await begin(req);

    const request = req.allParams();

    const validatedRequest = await validateRequest({
      body: request,
      schema: TaskQuery.schema,
    });

    if (validateRequest.state_id) {
      const State = await States;

      await modelRecordNotExists({
        Model: State,
        name: 'States',
        data: { id: validatedRequest.state_id },
      });
    }
    if (validatedRequest.assignee) {
      const User = await Users;

      await modelRecordNotExists({
        Model: User,
        name: 'User',
        data: { id: validatedRequest.assignee },
      });
    }

    const response = await count(validatedRequest);

    await end({ ...response }, event);

    return res.ok(response);
  } catch (err) {
    await error({ error: err.toString() }, event);

    const statusCode = await assignHttpStatusCode(err);
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const missedCall = async function missedCall(req, res) {
  const State = await States;
  const Beneficiary = await Beneficiaries;
  let event;
  try {
    event = await begin(req);
    const params = { ...req.allParams() };
    const beneficiaryMobile = params.CallFrom;
    const stateName = params.state;

    const state = await State.findOne({
      name: stateName,
    });

    const beneficiaries = await Beneficiary.find({
      state: state.id,
      mobile: beneficiaryMobile,
    });
    let beneficiary = {};

    if (beneficiaries.length !== 0) {
      const abc = '';
    } else {
      const beneficiaryModel = {};
      beneficiaryModel.mobile = beneficiaryMobile;
      beneficiaryModel.state = state.id;
      beneficiaryModel.source = 'Exotel';
      beneficiaryModel.config = {};

      beneficiaryModel.config.pFormPath = `${state.name.toLowerCase()}/persistent`;

      const token = await getToken();
      // prepare url
      const url = await sails.helpers.formio.forms.prepareUrl(
        URL_FORM,
        `${state.name.toLowerCase()}-persistent`,
      );

      const persistentForm = await get(token, {}, url);
      beneficiaryModel.config.pFormID = persistentForm._id;
      beneficiaryModel.config.exotelConfig = {
        missedCallCount: 0,
        ...params,
      };

      beneficiary = await modelCreate({
        validatedRequest: {
          ...beneficiaryModel,
        },
        model: Beneficiary,
      });
    }
  } catch (err) {
    await error(
      {
        error: err.toString(),
      },
      event,
    );
    const statusCode = await assignHttpStatusCode(err);
    return res.status(statusCode).json({
      error: err.toString(),
    });
  }

  // Checking if the beneficiary allready exists

  return res.json('okay');
};

module.exports = {
  config,
  create,
  patch,
  deleteTask,
  fetchOne,
  fetchAll,
  sync,
  prepTaskReport,
  prepFormReport,
  download,
  patchTask,
  missedCall,
  taskCount,
};
