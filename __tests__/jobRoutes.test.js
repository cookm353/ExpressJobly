const request = require('supertest')

const db = require("../dist/db.js")
const app = require("../dist/app.js")
const Job = require('../dist/models/job.js')

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
  } = require("../dist/routes/_testCommon.js")
const { BadRequestError, NotFoundError } = require('../dist/expressError')

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvb2ttMzUzIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjc1NjMwMDAwfQ.gJzz-gNmQLw3qvHh_q357JnOrzIQJxlsGt96cIDPFo8'
const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY3NTYzNTMyOX0.zE_i2emckq6W8Im-9iH3OZ3t3tTxeanbHipo_Ipvr2o'

/* POST /jobs */

describe('POST /jobs', () => {
    test('Throws error if missing JWT', async () => {
        try {
            await request(app).post('/jobs')
                .send({
                    title: 'j4',
                    salary: 4,
                    equity: '0.2',
                    company_handle: 'c1'
                })
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })
    
    test('Throws error if not admin', async () => {
        try {
            await request(app).post('/jobs')
                .send({
                    title: 'j4',
                    salary: 4,
                    equity: '0.2',
                    company_handle: 'c1'
                })
                .set("authorization", `Bearer ${userJWT}`)
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })
    
    test('Throws error w/ invalid schema', async () => {
        try {
            await request(app).post('/jobs')
                .send({
                    salary: 4,
                    equity: '0.2',
                    company_handle: 'c1'
                })
                .set("authorization", `Bearer ${adminJWT}`)
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })

    test('Throws error w/ invalid company handle', async () => {
        try {
            await request(app).post('/jobs')
                .send({
                    title: 'j4',
                    salary: 4,
                    equity: 0.2,
                    company_handle: 'c10'
                })
                .set("authorization", `${adminJWT}`)
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })

    test('Works as admin w/ valid schema and company handle', async () => {
        const resp = await request(app).post('/jobs')
            .send({
                title: 'j4',
                salary: 4,
                equity: 0.2,
                company_handle: 'c1'
            })
            .set("authorization", `${adminJWT}`)
        expect(resp.statusCode).toBe(201)
        expect(resp.body).toEqual({
            job:{
                title: 'j4',
                salary: 4,
                equity: '0.2',
                company_handle: 'c1'
        }})
    })
})

/* GET /jobs */

describe('GET /jobs', () => {
    test('Works', async () => {
        const resp = await request(app).get('/jobs')
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({jobs: [
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
        ]})
    })
})

/* GET /jobs/:id */

describe('GET /jobs/:id', () => {
    test('Throws error w/ invalid id', async () => {
        try {
            await request(app).get('/jobs/10')
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy()
        }
    })
    
    test('Works w/ valid id', async () => {
        const resp = await request(app).get('/jobs/1')
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ job: {
            title: 'j1',
            salary: 90000,
            equity: "0.6",
            company_handle: 'c1'
        }})
    })
})

/* PATCH /jobs/:id */

describe('PATCH /jobs/:id', () => {
    test('Throws error if not admin', async () => {
        try {
            await request(app).patch('/jobs/1')
                .send({
                    title: 'j10',
                    salary: 90000,
                    equity: 0.6,
                    company_handle: 'c1'
                })
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })
    
    test('Throws error w/ invalid schema', async () => {
        try {
            await request(app).patch('/jobs/1')
                .send({
                    title: 'j10',
                    salary: 90000,
                    equity: 0.6,
                    company_handle: 1
                })
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })

    test('Throws error w/ invalid id', async () => {
        try {
            await request(app).patch('/jobs/100')
                .send({
                    title: 'j10',
                    salary: 90000,
                    equity: 0.6,
                    company_handle: 'c1'
                })
                .set('authorization', adminJWT)
        } catch (err) {
            expect(err instanceof BadRequestError)
        }
    })

    test('Works w/ valid id and schema', async () => {
        const jobData = {
            title: "j10",
            salary: 9000,
            equity: 0.6,
            company_handle: 'c1'
        }
        
        const resp = await request(app).patch('/jobs/1')
            .send(jobData)
            .set('authorization', adminJWT)

            expect(resp.statusCode).toBe(200)
            expect(resp.body).toEqual({job: {
                title: "j10",
                salary: 9000,
                equity: '0.6',
                company_handle: 'c1'
            }})
    })
})

/* DELETE /jobs/:id */

describe('DELETE /jobs/:id', () => {
    test('Throws error w/ invalid id', async () => {
        try {
            await request(app).delete('/jobs/10')
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy()
        }
    })

    test('Works w/ valid id', async () => {
        await request(app).delete('/jobs/1')

        try {
            await request(app).get('/jobs/1')
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy()
        }
    })
})