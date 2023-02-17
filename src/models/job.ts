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
	 * Can filter on title, minSalary, and whether or not it has equity
	 * 
	 * Returns [{ title, salary, equity, company_handle }, ...]
	 */

	static buildFilter(filters): Object {
		const keys = Object.keys(filters)
		let sqlFilter = {
			whereClause: 'WHERE ',
			vals: []
		}
		const {title, minSalary, hasEquity} = filters
		let jobTitle
		if (title) jobTitle = `%${title.toLowerCase()}%`
		// One filter
		if (keys.length === 1) {
			if (title) {
				sqlFilter.whereClause += 'LOWER(title) LIKE $1'
				sqlFilter.vals.push(jobTitle)
			} else if (minSalary) {
				sqlFilter.whereClause += 'salary >= $1'
				sqlFilter.vals.push(minSalary)
			} else if (hasEquity === true) {
				sqlFilter.whereClause += 'CAST(equity AS DOUBLE PRECISION) > $1'
				sqlFilter.vals.push(0)
			}
		// Two filters
		} else if (keys.length === 2) {
			if (title) {
				sqlFilter.whereClause += 'LOWER(title) LIKE $1'
				sqlFilter.vals.push(jobTitle)
				if (minSalary) {
					sqlFilter.whereClause += ' AND salary >= $2'
					sqlFilter.vals.push(minSalary)
				} else {
					sqlFilter.whereClause += ' AND CAST(equity AS DOUBLE PRECISION) > $2'
					sqlFilter.vals.push(0)
				}
			} else if (minSalary) {
				sqlFilter.whereClause += 'salary >= $1 AND CAST(equity AS DOUBLE PRECISION) > $2'
				sqlFilter.vals.push(minSalary, 0.0)
			}
		// Three filters
		} else {
			sqlFilter.whereClause += 'LOWER(title) LIKE $1 AND salary >= $2 AND CAST(equity AS DOUBLE PRECISION) > $3'
			sqlFilter.vals.push(jobTitle, minSalary, 0.0)
		}

		return sqlFilter
	}

    static async findAll(filters) {
		const keys: Array<String> = Object.keys(filters)
		let jobsResp

		if (keys.length === 0) {
			jobsResp = await db.query(
				`SELECT id, title, salary, equity, company_handle
				FROM jobs`
			)
		} else if (keys.length >= 1) {
			const filter = this.buildFilter(filters)
			jobsResp = await db.query(
				`SELECT id, title, salary, equity, company_handle
				FROM jobs
				${filter['whereClause']}`,
				filter['vals']
			)
		}

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