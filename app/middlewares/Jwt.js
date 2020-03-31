const jwt = require('jsonwebtoken');

const authenticate = () => {
  return (req, res, next) => {
    let token = req.header('Authorization');

    if (token == null || token == '')
      return res.status(401).send('You are not authenticated');

    let authentic = jwt.verify(token, process.env.JWT_SECRET);
    if (authentic && authentic.id) next();
    else res.status(403).send('You are not authorized');
  };
};

const getUser = (req, res) => {
  let token = req.header('Authorization');

  if (token == null || token == '')
    return res.status(401).send('You are not authenticated');

  let authentic = jwt.verify(token, process.env.JWT_SECRET);
  if (authentic && authentic.id) return authentic.id;
  else return res.status(401).send('You are not authenticated');
};

module.exports = { authenticate, getUser };
