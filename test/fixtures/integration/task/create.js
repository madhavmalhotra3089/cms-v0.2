const randomObjectGenerator = require('../../../../seeds/random-object-get');

module.exports = {
  validation: [
    {
      data: {
        type: randomObjectGenerator.getDatabaseObject('task_type'),
        status: '71b22e5d-e7d5-4ef1-a832-867fa776f996',
        beneficiary: '35a406dc-4fe2-429e-a55b-b0d126bb6662',
        state: '53d6a469-4db7-470a-bd43-6778dfbe7b32',
        assignee: '3f961838-e98b-4d74-9c56-ce05bda6ee51',
      },
    },
    {
      data: {
        type: 'f089e51a-ca36-4b56-a9f9-ca7f9acc851b',
        status: '71b22e5d-e7d5-4ef1-a832-867fa776f996',
        beneficiary: '35a406dc-4fe2-429e-a55b-b0d126bb6662',
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            state: '"state" is required',
          },
        ],
      },
    },
    {
      data: {
        type: 'f089e51a-ca36-4b56-a9f9-ca7f9acc851b',
        status: '71b22e5d-e7d5-4ef1-a832-867fa776f996',
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            beneficiary: '"beneficiary" is required',
          },
          {
            state: '"state" is required',
          },
        ],
      },
    },
    {
      data: {
        type: 'f089e51a-ca36-4b56-a9f9-ca7f9acc851b',
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            status: '"status" is required',
          },
          {
            beneficiary: '"beneficiary" is required',
          },
          {
            state: '"state" is required',
          },
        ],
      },
    },
    {
      data: {},
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            type: '"type" is required',
          },
          {
            status: '"status" is required',
          },
          {
            beneficiary: '"beneficiary" is required',
          },
          {
            state: '"state" is required',
          },
        ],
      },
    },
  ],
};
