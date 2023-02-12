"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to check if the user is an admin
 * 
 * If not, raises Unauthorized.
 */

function ensureIsAdmin(req, resp, next) {
  try {
    const authHeader = req.headers && req.headers.authorization
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const user = jwt.verify(token, SECRET_KEY)
      
      if (!user.isAdmin) throw new UnauthorizedError()
    } else {
      throw new UnauthorizedError()
    }
    return next()
  } catch (err) {
    return next(err)
  }
}

/** Middleware to check if user is an admin or valid user for getting user
 * details, updating user, or deleting user
 * 
 * If not, raises Unauthorized
 */

function ensureIsAdminOrCorrectUser(req, resp, next) {
  try {
    const authHeader = req.headers && req.headers.authorization
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const user = jwt.verify(token, SECRET_KEY)

      if (user.username !== req.params.username && !user.isAdmin) throw new UnauthorizedError()
    } else {
      throw new UnauthorizedError()
    }

    return next()
  } catch(err) {
    return next(err)
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureIsAdminOrCorrectUser
};

// function main() {
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvb2ttMzUzIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjc1NjMwMDAwfQ.gJzz-gNmQLw3qvHh_q357JnOrzIQJxlsGt96cIDPFo8'
//   const result = jwt.verify(token, SECRET_KEY)
//   console.log(result)
// }

// main()
