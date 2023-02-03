const { BadRequestError } = require('../dist/expressError')
const { sqlForPartialUpdate } = require('../dist/helpers/sql')

describe("sqlForPartialUpdate", () => {
    test("Convert POJO to a SQL string", () => {
        const newData = {
            firstName: "Joe",
            lastName: "Schmoe"
        }
        const cols = {
            col1: "firstName",
            col2: "lastName"
        }
        expect(sqlForPartialUpdate(newData, cols)).toEqual({
            setCols: '"firstName"=$1, "lastName"=$2',
            values: [ 'Joe', 'Schmoe' ]
          })
    })

    test("Get an error if there aren't any keys", () => {
        const newData = {}
        const cols = {}
        try {
            sqlForPartialUpdate(newData, cols)
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestError)
        }
    })
})