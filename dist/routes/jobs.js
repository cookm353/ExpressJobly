const jsonschema = require('jsonschema');
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureIsAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const jobNewSchema = require('../../schemas/jobNew.json');
const jobUpdateSchema = require('../../schemas/jobUpdate.json');
const router = new express.Router();
/** POST / { job } => { job }
 *
 * Job should be { title, salary, equity, company_handle }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Auth required: admin
*/
router.post('/', ensureIsAdmin, async (req, resp, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { title, salary, equity, company_handle } = req.body;
        const job = await Job.create(title, salary, equity, company_handle);
        return resp.status(201).json({ job });
    }
    catch (err) {
        return next(err);
    }
});
router.get('/', async (req, resp, next) => {
    try {
        let filters = {};
        if (req.body.title)
            filters['title'] = req.body.title;
        if (req.body.minSalary)
            filters['minSalary'] = req.body.minSalary;
        if (req.body.hasEquity)
            filters['hasEquity'] = true;
        const jobs = await Job.findAll(filters);
        return resp.json({ jobs });
    }
    catch (err) {
        return next(err);
    }
});
/** GET /[id] => { job }
 *
 * Job is { id, title, salary, equity, company_handle}
 *
 * Auth required: none
*/
router.get('/:id', async (req, resp, next) => {
    try {
        const { id } = req.params;
        const job = await Job.get(id);
        return resp.json({ job });
    }
    catch (err) {
        return next(err);
    }
});
/** PATCH /[id] { field1, field2, ...} => { job }
 *
 * Patches job data
 *
 * Fields can be { title, salary, equity, company_handle}
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Auth required: admin
*/
router.patch('/:id', ensureIsAdmin, async (req, resp, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.update(req.params.id, req.body);
        return resp.json({ job });
    }
    catch (err) {
        return next(err);
    }
});
/** DELETE /[id] => { delete: id }
 *
 * Auth required: admin
*/
router.delete('/:id', ensureIsAdmin, async (req, resp, next) => {
    try {
        const { id } = req.params;
        await Job.remove(id);
        return { deleted: id };
    }
    catch (err) {
        return next(err);
    }
});
module.exports = router;
