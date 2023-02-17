"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
/** Related functions for companies. */
class Company {
    /** Create a company (from data), update db, return new company data.
     *
     * data should be { handle, name, description, numEmployees, logoUrl }
     *
     * Returns { handle, name, description, numEmployees, logoUrl }
     *
     * Throws BadRequestError if company already in database.
     * */
    static async create({ handle, name, description, numEmployees, logoUrl }) {
        const duplicateCheck = await db.query(`SELECT handle
           FROM companies
           WHERE handle = $1`, [handle]);
        if (duplicateCheck.rows[0])
            throw new BadRequestError(`Duplicate company: ${handle}`);
        const result = await db.query(`INSERT INTO companies
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`, [
            handle,
            name,
            description,
            numEmployees,
            logoUrl,
        ]);
        const company = result.rows[0];
        return company;
    }
    /**
     * Creates WHERE clause to filter when finding all companies
     */
    static buildFilter(filters) {
        const keys = Object.keys(filters);
        let sqlFilter = {
            whereClause: "WHERE ",
            vals: []
        };
        const { name, minEmployees, maxEmployees } = filters;
        // Only one filter
        if (keys.length === 1) {
            if (name) {
                sqlFilter.whereClause += `handle LIKE $1`;
                sqlFilter.vals.push(name);
            }
            else if (minEmployees) {
                sqlFilter.whereClause += "num_employees < $1";
                sqlFilter.vals.push(minEmployees);
            }
            else {
                sqlFilter.whereClause += "num_employees > $1";
                sqlFilter.vals.push(maxEmployees);
            }
            // Two filters
        }
        else if (keys.length === 2) {
            if (name) {
                sqlFilter.whereClause += `handle LIKE $1`;
                sqlFilter.vals.push(name);
                if (minEmployees) {
                    sqlFilter.whereClause += ' and num_employees > $2';
                    sqlFilter.vals.push(minEmployees);
                }
                else {
                    sqlFilter.whereClause += ' and num_employees < $2';
                    sqlFilter.vals.push(maxEmployees);
                }
            }
            if (minEmployees && maxEmployees) {
                sqlFilter.whereClause += 'num_employees BETWEEN $1 AND $2';
                sqlFilter.vals.push(minEmployees, maxEmployees);
            }
            // All three
        }
        else if (keys.length === 3) {
            sqlFilter.whereClause += 'handle = $1 AND num_employees BETWEEN $2 AND $3';
            sqlFilter.vals.push(name, minEmployees, maxEmployees);
        }
        return sqlFilter;
    }
    /** Find all companies.
     *
     * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
     * */
    static async findAll(filters) {
        let companiesResp;
        const keys = Object.keys(filters);
        if (keys.length >= 1) {
            const filter = this.buildFilter(filters);
            companiesResp = await db.query(`SELECT handle,
          name,
          description,
          num_employees AS "numEmployees",
          logo_url AS "logoUrl"
         FROM companies
         ${filter['whereClause']}
         ORDER BY name`, filter['vals']);
        }
        else {
            companiesResp = await db.query(`SELECT handle,
        name,
        description,
        num_employees AS "numEmployees",
        logo_url AS "logoUrl"
      FROM companies
      ORDER BY name`);
        }
        return companiesResp.rows;
    }
    /** Given a company handle, return data about company.
     *
     * Returns { handle, name, description, numEmployees, logoUrl, jobs }
     *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
     *
     * Throws NotFoundError if not found.
     **/
    static async get(handle) {
        const companyRes = await db.query(`SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`, [handle]);
        const company = companyRes.rows[0];
        if (!company)
            throw new NotFoundError(`No company: ${handle}`);
        return company;
    }
    /** Update company data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {name, description, numEmployees, logoUrl}
     *
     * Returns {handle, name, description, numEmployees, logoUrl}
     *
     * Throws NotFoundError if not found.
     */
    static async update(handle, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            numEmployees: "num_employees",
            logoUrl: "logo_url",
        });
        const handleVarIdx = "$" + (values.length + 1);
        const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
        const result = await db.query(querySql, [...values, handle]);
        const company = result.rows[0];
        if (!company)
            throw new NotFoundError(`No company: ${handle}`);
        return company;
    }
    /** Delete given company from database; returns undefined.
     *
     * Throws NotFoundError if company not found.
     **/
    static async remove(handle) {
        const result = await db.query(`DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`, [handle]);
        const company = result.rows[0];
        if (!company)
            throw new NotFoundError(`No company: ${handle}`);
    }
}
module.exports = Company;
