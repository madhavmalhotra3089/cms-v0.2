const { UnauthorisedException, OperationException } = require('../../api/exceptions');

const { assignHttpStatusCode } = sails.helpers.errorHandling;
// const verifyToken
module.exports = async function (req, res, proceed) {
  try {
    const { authorization_token: authorizationToken } = req.headers;
    if (!authorizationToken) {
      throw new UnauthorisedException.UnauthorisedException(
        'You need to log in to complete action.',
      );
    }
    const decodedToken = await sails.helpers.jwt.verifyToken(authorizationToken);
    const user = await Users.findOne({
      id: decodedToken.user,
    });
    if (!user) {
      throw new UnauthorisedException.UnauthorisedException('User not found.');
    }
    req.session.user = { ...user };
    return proceed();
  } catch (err) {
    const sendStatus = await assignHttpStatusCode(err);
    switch (err.name) {
      case 'UnauthorisedException':
        return res.status(sendStatus).json(err.toString());
      default:
        return res
          .status(sendStatus)
          .json(new OperationException.OperationException(err.message).toString());
    }
  }
};
