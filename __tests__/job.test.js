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

/** Create */

describe('Job.create()', () => {
    test("Create new job w/ valid handle", async () => {
        const newJob = await Job.create('j4', 4, 0.2, 'c1')
        expect(newJob).toEqual({
            title: 'j4',
            salary: 4,
            equity: '0.2',
            company_handle: 'c1'
        })

        const jobTest = await Job.get(4)
        expect(jobTest).toEqual(newJob)
    })

    test("Get error w/ invalid handle", async () => {
        try {
            const newJob = await Job.create('j4', 4, 0.2, 'c1')
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy()
        }
    })
})

/** Find All */

describe("Job.findAll()", () => {
    test("Find all jobs", async () => {
        const jobs = await Job.findAll()
        expect(jobs).toEqual([
            {
                id: 1,
                title: 'j1',
                salary: 90000,
                equity: "0.6",
                company_handle: 'c1'
            },
            {
                id: 2,
                title: 'j2',
                salary: 65000,
                equity: '0.0',
                company_handle: 'c2'
            },
            {
                id: 3,
                title: 'j3',
                salary: 100000,
                equity: '0.9',
                company_handle: 'c3'
            }
        ])
    })
})

/** Get */

describe("Job.get()", () => {
    test("Works w/ valid id", async () => {
        const job = await Job.get(1)
        expect(job).toEqual({
            title: 'j1',
            salary: 90000,
            equity: "0.6",
            company_handle: 'c1'
        })
    })

    test('Throws error w/ invalid id', async () => {
        try {
            const job = await Job.get(4)
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy()
        }
    })
})

/** Update */

describe('Job.update()', () => {
    test('Works with all fields', async () => {
        const jobData = {
            title: 'j10',
            salary: 2,
            equity: 0.1,
            company_handle: "c2"
        }

        const newJob1 = await Job.update(1, jobData)
        const job = await Job.get(1)
        expect(newJob1).toEqual({
            title: 'j10',
            salary: 2,
            equity: '0.1',
            company_handle: 'c2'
        })
        expect(newJob1).toEqual(job)
    })

    test("Works with just 1 field", async () => {
        const jobData = {title: 'j10'}

        const newJob1 = await Job.update(1, jobData)
        const job = await Job.get(1)
        expect(newJob1).toEqual({
            title: 'j10',
            salary: 90000,
            equity: "0.6",
            company_handle: 'c1'
        })
        expect(newJob1).toEqual(job)
    })

    test("Throws error w/ invalid id", async () => {
        try {
            const jobData = {
                title: 'j10',
                salary: 2,
                equity: 0.1,
                company_handle: "c2"
            }    
            const job = await Job.get(10, jobData)
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy()
        }
    })
})

/** Remove */

describe('Job.remove()', () => {
    test("Works w/ valid id", async () => {
        await Job.remove(1)

        try {
            await Job.get(1)
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy()
        }
    })

    test('Throws error w/ invalid id', async () => {
        try {
            await Job.remove(10)
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy()
        }
    })
})