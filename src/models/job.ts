const db = require('../db')
const { NotFoundError, BadRequestError } = require("../expressError")
const { sqlForPartialUpdate } = require("../helpers/sql")
const Company = require('./company')
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");


/** Related functions for jobs */

class Job {
    /**
     * Create a new job from data, update DB, and return job data
     * 
     * Data should be { title, salary, equity, company_handle }
	 * 
	 * Returns { title, salary, equity, company_handle }
	 * 
	 * Throws NotFoundError if company handle not found
     */
    static async create(title, salary, equity, company_handle) {
		const companyCheck = await db.query(
			`SELECT handle
			FROM companies
			WHERE handle = $1`,
			[company_handle]
		)

		if (!companyCheck.rows[0]) {
			throw new NotFoundError(`Company not found: ${company_handle}`)
		}
		
		const jobsResp = await db.query(
			`INSERT INTO jobs
			(title, salary, equity, company_handle)
			VALUES ($1, $2, $3, $4)
			RETURNING title, salary, equity, company_handle`,
			[title, salary, equity, company_handle]
		)

		const job = jobsResp.rows[0]

		return job
    }

	/** Given a job id, returns data about job
	 * 
	 * Returns { title, salary, equity, company_handle }
	 * 
	 * Throws NotFoundError if not found
	 */
    static async get(id) {
		const jobResp = await db.query(
			`SELECT title, salary, equity, company_handle
			FROM jobs
			WHERE id = $1`,
			[id]
		)

		const job = jobResp.rows[0]
		if (!job) throw new NotFoundError(`No job: ${id}`)
		
		return job
    }

	/** Find all jobs
	 * 
	 * Returns [{ title, salary, equity, company_handle }, ...]
	 */
    static async findAll() {
		const jobsResp = await db.query(
				`SELECT id, title, salary, equity, company_handle
				FROM jobs`
			)

		return jobsResp.rows
    }

	/** Update job data with 'data'
	 * 
	 * Supports partial updates
	 * 
	 * Data can include: { title, salary, equity, company_handle }
	 * 
	 * Throws NotFound Error if not found
	 */
    static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(
			data,
			{
				title: 'title',
				salary: 'salary',
				equity: 'equity',
				company_handle: 'company_handle'
			}
		)
		const handleVarIdx = '$' + (values.length + 1)

		const querySql = `
			UPDATE jobs
			SET ${setCols}
			WHERE id = ${handleVarIdx}
			RETURNING title,
				salary,
				equity,
				company_handle
		`
		
		const resp = await db.query(querySql, [...values, id])
		const job = resp.rows[0]

		if (!job) throw new NotFoundError(`No job: ${id}`)

		return job
    }

	/** Delete specified job from DB; returns undefined
	 * 
	 * Throws NotFoundError if job not found
	 */

    static async remove(id) {
		const resp = await db.query(
			`DELETE FROM jobs
			WHERE id = $1
			RETURNING id`,
			[id]
		)
		const job = resp.rows[0]

		if (!job) throw new NotFoundError(`No job: ${id}`)
    }
}

module.exports = Job