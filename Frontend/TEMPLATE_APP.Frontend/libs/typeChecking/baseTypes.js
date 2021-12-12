import TypeChecking from "./typeChecking.js"

let BaseTypes = [
    {
        TypeName: "Array",
        Check: (value) => TypeChecking._isArray(value)
    },
    {
        TypeName: "Promise",
        Check: (value) => TypeChecking._isPromise(value)
    },
    {
        TypeName: "object",
        Check: (value) => {
            if (value === null || value === undefined) {
                return false;
            }
            return true;
        }
    },
    {
        TypeName: "function",
        Check: (value) => {
            return typeof (value) === "function";
        }
    },
    {
        TypeName: "undefined",
        Check: (value) => {
            if (value === undefined) {
                return true;
            }
            return false;
        }
    },
    {
        TypeName: "boolean",
        Check: (value) => TypeChecking._isBoolean(value)
    },
    {
        TypeName: "number",
        Check: (value) => TypeChecking._isNumber(value)
    },
    {
        TypeName: "int",
        Check: (value) => {
            if (!TypeChecking._isNumber(value))
                return false;
            return Number.isInteger(value + 1);
        }
    },
    {
        TypeName: "string",
        Check: (value) => TypeChecking._isString(value)
    }
]

export default BaseTypes;