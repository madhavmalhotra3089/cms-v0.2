module.exports = {
  validation: [
    {
      data: {},
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            name: '"name" is required',
          },
        ],
      },
    },
    {
      data: {
        name: 123,
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            name: '"name" must be a string',
          },
        ],
      },
    },
    {
      data: {
        name: 'someCycle',
        description: 123,
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            description: '"description" must be a string',
          },
        ],
      },
    },
  ],
  create: [
    {
      data: { name: 'Test1' },
      output: {
        data: {
          name: 'Test1',
          deleted: false,
        },
      },
    },
    {
      data: { name: 'Test2' },
      output: {
        data: {
          name: 'Test2',
          deleted: false,
        },
      },
    },
    {
      data: { name: 'Test2' },
      error: {
        type: 'RecordAlreadyExistsException',
        message: 'Cycles already exists',
        additionalInfo: 'Unique Constraint on : name',
      },
    },
  ],
};
