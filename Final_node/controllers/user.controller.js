const userService = require("../services/user.service");

module.exports = {
  authenticate,
  getAllUsers,
  getUsername,
  getByUsername,
  register,
  addCredential,
  getCredentials,
  deleteCredential,
  getSharedWithMe,
  editCredential,
  getUsernames,
  shareCredential
};

function authenticate(req, res, next) {
  console.log("Authenticate():", req.body);
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

function getAllUsers(req, res, next) {
  //  console.log("getAll", req.body);
  userService
    .getAllUsers()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .addUser(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getUsername(req, res, next) {
  userService
    .getUsername(req.params.username)
    .then((name) => res.json(name))
    .catch((err) => next(err));
}

function getByUsername(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .getByUsername(username)
    .then((name) => res.json(name))
    .catch((err) => next(err));
}

function addCredential(req, res, next) {
  //TODO: via parecordSerice you should add a PA record and respond to the client confirming that the record was successfully added.
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .addCredential(req.body, username)
    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Add did not Work" })
    )
    .catch((err) => next(err));
}

function getCredentials(req, res, next) {
  //TODO: return all parecords from the database and send to the client.
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .getCredentials(username)
    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Get did not Work" })
    )
    .catch((err) => next(err));
}

function getUsernames(req, res, next) {
  //TODO: return all parecords from the database and send to the client.

  userService
    .getUsernames()
    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Get did not Work" })
    )
    .catch((err) => next(err));
}

function shareCredential(req, res, next) {
  //TODO: via parecordSerice you should add a PA record and respond to the client confirming that the record was successfully added.
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .shareCredential(req.body, username)
    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Share did not Work" })
    )
    .catch((err) => next(err));
}

function getSharedWithMe(req, res, next) {
  //TODO: return all parecords from the database and send to the client.
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .getSharedWithMe(username)
    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Get did not Work" })
    )
    .catch((err) => next(err));
}

function deleteCredential(req, res, next) {
  //TODO: delete parecord from the database and respond to the client by conforming the action.
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .deleteCredential(req.params.domain,  username)

    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Delete did not Work" })
    )
    .catch((err) => next(err));
}

function editCredential(req, res, next) {
  //TODO: via parecordSerice you should add a PA record and respond to the client confirming that the record was successfully added.
  const token = req.headers.authorization.split(" ")[1];
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ).sub;
  userService
    .editCredential(req.body, username)
    .then((response) =>
      response
        ? res.json(response)
        : res.status(400).json({ message: "Add did not Work" })
    )
    .catch((err) => next(err));
}
