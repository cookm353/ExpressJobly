const { BadRequestError } = require("../expressError");
/** Converts JS object holding data to update for a given row
 * to SQL.  dataToUpdate should be an object holding the updated
 * values as values, jsToSql should be an object holding the names
 * of the columns as values
 *
 * dataToUpdate = {
 *  firstName: "Alice",
 *  lastName: "Tester"
 * }
 *
 * jsToSql = {
 *  col1: "firstName",
 *  col2: "lastName"
 * }
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0)
        throw new BadRequestError("No data");
    // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
    const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);
    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate),
    };
}
module.exports = { sqlForPartialUpdate };
