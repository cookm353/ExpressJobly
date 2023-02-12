const db = require('../db');
const { NotFoundError, BadRequestError, UnauthorizedError, } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
/** Related functions for jobs */
class Job {
    /**
     * Create a new job from data, update DB, and return job data
     *
     * Data should be {}
     */
    static async create() {
    }
    static async get(id) {
        const jobResp = await db.query(`SELECT title, salary, equity, company_handle
			FROM jobs
			WHERE id = $1`, [id]);
        const job = jobResp.rows[0];
        if (!job)
            throw new NotFoundError(`No job: ${id}`);
        return job;
    }
    static async findAll() {
        const resp = await db.query();
    }
    static async update(id) {
        const resp = await db.query();
    }
    /** Delete specified job from DB; returns undefined
     *
     * Throws NotFoundError if job not found
     */
    static async remove(id) {
        const resp = await db.query(`DELETE FROM jobs
			WHERE id = $1
			RETURNING id`, [id]);
        const job = resp.row[0];
        if (!job)
            throw new NotFoundError(`No job: ${id}`);
    }
}
module.exports = Job;
