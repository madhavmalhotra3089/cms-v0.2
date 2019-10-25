/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /** *************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ************************************************************************** */

  '/': { view: 'pages/homepage' },
  // USER
  'POST /user': 'UsersController.create',
  'GET /user': 'UsersController.fetchAll',
  'GET /user/:id': 'UsersController.fetchOne',
  'PATCH /user/:id': 'UsersController.patch',
  'DELETE /user/:id': 'UsersController.deleteUser',
  'GET /user/config': 'UsersController.config',
  'POST /user/EnableDisableUser': 'UsersController.deleteUser',
  'POST /user/AssignPermission': 'UsersController.assignPermission',
  'POST /user/RemovePermission': 'UsersController.removePermission',

  // AUTH
  'GET /auth/config': 'AuthController.config',
  'POST /user/login': 'AuthController.logIn',
  'POST /user/forgotpassword/sendotp': 'AuthController.sendOtp',
  'POST /user/forgotpassword/verifyOtp': 'AuthController.verifyOtp',
  'POST /user/forgotpassword/resendOtp': 'AuthController.resendOtp',
  'POST /user/resetpassword': 'AuthController.resetPassword',
  'POST /user/changepassword': 'AuthController.changePassword',

  // FEATURES
  'GET /feature/config': 'FeatureController.config',
  'GET /feature': 'FeatureController.fetchAll',

  // BENEFICIARY
  'POST /beneficiaries/': 'BeneficiaryController.create',
  'PATCH /beneficiaries/': 'BeneficiaryController.patch',
  'DELETE /beneficiaries/': 'BeneficiaryController.deleteUser',
  'GET /beneficiaries/:id': 'BeneficiaryController.fetchOne',
  'GET /beneficiaries/': 'BeneficiaryController.fetchAll',
  'GET /beneficiaries/config': 'BeneficiaryController.config',

  // FORMIO FORMS
  'POST /forms': 'formio/FormController.create',
  'GET /forms': 'formio/FormController.findAll',
  'GET /forms/:id': 'formio/FormController.findOne',
  'PATCH /forms/:id': 'formio/FormController.update',
  'DELETE /forms/:id': 'formio/FormController.deleteForm',

  // TaskStatus
  'post /taskstatus/': 'TaskStatusController.create',
  'patch /taskstatus/': 'TaskStatusController.patch',
  'delete /taskstatus/': 'TaskStatusController.disable',
  'get /taskstatus/:id': 'TaskStatusController.fetchOne',
  'get /taskstatus/': 'TaskStatusController.fetchAll',
  'get /taskstatus/config': 'TaskStatusController.config',

  // Tasks
  'post /tasks/': 'TasksController.create',
  'post /tasks/sync/': 'TasksController.sync',
  'patch /tasks/': 'TasksController.patch',
  'delete /tasks/': 'TasksController.deleteTask',
  'get /tasks/missedcall': 'TasksController.missedCall',
  'get /tasks/:id': 'TasksController.fetchOne',
  'get /tasks/': 'TasksController.fetchAll',
  'get /tasks/config': 'TasksController.config',
  'patch /tasks/assign': 'TasksController.patchTask',
  'get /task/count/': 'TasksController.taskCount',

  // Task Types
  'POST /tasktypes': 'TaskTypeController.create',
  // FORMIO SUBMISSION
  'POST /forms/:id/submissions': 'formio/SubmissionController.create',
  'GET /forms/:id/submissions': 'formio/SubmissionController.findAll',
  'GET /forms/:id/submissions/:submission': 'formio/SubmissionController.findOne',
  'PATCH /forms/:id/submissions/:submission': 'formio/SubmissionController.update',
  'DELETE /forms/:id/submissions/:submission': 'formio/SubmissionController.deleteSubmission',

  // TASK STATUS
  'POST /taskstatus/': 'TaskStatusController.create',
  'PATCH /taskstatus/': 'TaskStatusController.patch',
  'DELETE /taskstatus/': 'TaskStatusController.disable',
  'GET /taskstatus/:id': 'TaskStatusController.fetchOne',
  'GET /taskstatus/': 'TaskStatusController.fetchAll',
  'GET /taskstatus/config': 'TaskStatusController.config',

  // CYCLES
  'POST /cycles': 'CyclesController.create',
  'GET /cycles': 'CyclesController.findAll',
  'GET /cycles/:id': 'CyclesController.findOne',
  'PATCH /cycles/:id': 'CyclesController.update',
  'DELETE /cycles': 'CyclesController.deleteCycles',

  'GET /tasktypes': 'TaskTypeController.filter',
  'GET /tasktypes/:id': 'TaskTypeController.findOne',
  'PATCH /tasktypes/:id': 'TaskTypeController.update',
  'DELETE /tasktypes': 'TaskTypeController.deleteTaskTypes',

  // TASK
  'POST /tasks/': 'TasksController.create',
  'PATCH /tasks/': 'TasksController.patch',
  'DELETE /tasks/': 'TasksController.disable',
  'GET /tasks/:id': 'TasksController.fetchOne',
  'GET /tasks/': 'TasksController.fetchAll',
  'GET /tasks/config': 'TasksController.config',
  'POST /tasks/download/form-report': 'TasksController.prepFormReport',
  'POST /tasks/download/task-report': 'TasksController.prepTaskReport',
  'GET /tasks/download': 'TasksController.download',

  // TEMPLATES
  'POST /templates': 'TemplatesController.create',
  'GET /templates': 'TemplatesController.findAll',
  'GET /templates/:id': 'TemplatesController.findOne',
  'PATCH /templates/:id': 'TemplatesController.update',
  'DELETE /templates/:id': 'TemplatesController.deleteTemplate',
  'POST /templates/restore/:id': 'TemplatesController.restore',
  'POST /templates/send': 'TemplatesController.sendMessage',

  /** *************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ************************************************************************** */
};
