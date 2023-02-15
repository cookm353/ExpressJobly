const db = require('../dist/db')
const Job = require('../dist/models/job')
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../dist/expressError")
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../dist/models/_testCommon")

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/** Find All */

describe("Job.findAll()", () => {
    test("Find all jobs", async () => {
        
    })
})