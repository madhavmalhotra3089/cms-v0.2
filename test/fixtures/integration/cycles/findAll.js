module.exports = {
  validation: [
    {
      data: {
        page_size: '123a',
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            page_size: '"page_size" must be a number',
          },
        ],
      },
    },
    {
      data: {
        deleted: 'someOther',
      },
      error: {
        type: 'validationException',
        message: 'Validation Error',
        additionalInfo: [
          {
            deleted: '"deleted" must be one of [true, false, all]',
          },
        ],
      },
    },
  ],
};
