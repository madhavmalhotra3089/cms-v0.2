module.exports = {
  validation: [
    {
      data: {
        assignee: [
          'f6550322-d6c3-4911-afbd-f520161b6ca1',
          '512f5d80-d996-4860-ac0c-d8e6dcfba967',
          'b8ab31b2-c6ed-4190-a194-237863e57ff3',
          'd492e345-e145-46fb-bd0a-dab48612b513',
        ],
        Task: [
          '26a79753-c7ac-4da3-8778-11735fd59d65',
          'bf1436ae-8635-4495-977d-ee3db1d21e07',
          'b20a8f05-2d45-4d57-ba2d-64ca7ca40296',
          'b3d60177-9973-4867-9066-8182edc4826b',
          '8a7bc711-2968-42f6-a8a7-8e751835fb9e',
          'e94c6193-44ef-4275-8e29-4cad51e6bbc0',
          '24e22ba0-e085-4881-8034-7b11e88b0517',
        ],
      },
    },
    {
      data: {
        assignee: [],
        Task: [
          '26a79753-c7ac-4da3-8778-11735fd59d65',
          'bf1436ae-8635-4495-977d-ee3db1d21e07',
          'b20a8f05-2d45-4d57-ba2d-64ca7ca40296',
          'b3d60177-9973-4867-9066-8182edc4826b',
          '8a7bc711-2968-42f6-a8a7-8e751835fb9e',
          'e94c6193-44ef-4275-8e29-4cad51e6bbc0',
          '24e22ba0-e085-4881-8034-7b11e88b0517',
        ],
      },
      error: {
        type: 'ValidationException',
        message: 'Validation Error',
        httpcode: 400,
        additionalInfo: [
          {
            assignee: '"assignee" does not contain 1 required value(s)',
          },
        ],
      },
    },
    {
      data: {
        assignee: [
          'f6550322-d6c3-4911-afbd-f520161b6ca1',
          '512f5d80-d996-4860-ac0c-d8e6dcfba967',
          'b8ab31b2-c6ed-4190-a194-237863e57ff3',
          'd492e345-e145-46fb-bd0a-dab48612b513',
        ],
        Task: [],
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        httpcode: 400,
        additionalInfo: [
          {
            Task: '"Task" does not contain 1 required value(s)',
          },
        ],
      },
    },
    {
      data: {
        assignee: [''],
        Task: [
          '26a79753-c7ac-4da3-8778-11735fd59d65',
          'bf1436ae-8635-4495-977d-ee3db1d21e07',
          'b20a8f05-2d45-4d57-ba2d-64ca7ca40296',
          'b3d60177-9973-4867-9066-8182edc482bb',
          '8a7bc711-2968-42f6-a8a7-8e751835fb9e',
          'e94c6193-44ef-4275-8e29-4cad51e6bbc0',
          '24e22ba0-e085-4881-8034-7b11e88b0518',
        ],
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        httpcode: 400,
        additionalInfo: [
          {
            'assignee->0': '"0" is not allowed to be empty',
          },
          {
            'assignee->0': '"0" must be a valid GUID',
          },
          {
            assignee: '"assignee" does not contain 1 required value(s)',
          },
        ],
      },
    },
    {
      data: {
        assignee: [
          'f6550322-d6c3-4911-afbd-f520161b6ca1',
          '512f5d80-d996-4860-ac0c-d8e6dcfba967',
          'b8ab31b2-c6ed-4190-a194-237863e57ff3',
          'd492e345-e145-46fb-bd0a-dab48612b513',
        ],
        Task: [''],
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        httpcode: 400,
        additionalInfo: [
          {
            'Task->0': '"0" is not allowed to be empty',
          },
          {
            'Task->0': '"0" must be a valid GUID',
          },
          {
            Task: '"Task" does not contain 1 required value(s)',
          },
        ],
      },
    },
  ],
};
