import TypeChecking from "./typeChecking.js"
import BaseTypes from "./baseTypes";

const BaseTypesDefinitions = [
    {
        TypeName: "Array",
        TypeClass: BaseTypes.Array,
        Check: (value) => TypeChecking._isArray(value)
    },
    {
        TypeName: "Promise",
        TypeClass: BaseTypes.Promise,
        Check: (value) => TypeChecking._isPromise(value)
    },
    {
        TypeName: "object",
        TypeClass: BaseTypes.Object,
        Check: (value) => {
            if (value === null || value === undefined) {
                return false;
            }
            return true;
        }
    },
    {
        TypeName: "function",
        TypeClass: BaseTypes.Func,
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
        TypeClass: BaseTypes.Bool,
        Check: (value) => TypeChecking._isBoolean(value)
    },
    {
        TypeName: "number",
        TypeClass: BaseTypes.Double,
        Check: (value) => TypeChecking._isNumber(value)
    },
    {
        TypeName: "int",
        TypeClass: BaseTypes.Int,
        Check: (value) => {
            if (!TypeChecking._isNumber(value))
                return false;
            return Number.isInteger(value + 1);
        }
    },
    {
        TypeName: "string",
        TypeClass: BaseTypes.String,
        Check: (value) => TypeChecking._isString(value)
    }
]

export default BaseTypesDefinitions;