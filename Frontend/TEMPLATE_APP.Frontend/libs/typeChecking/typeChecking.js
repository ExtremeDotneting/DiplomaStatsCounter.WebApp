import { FunctionArgumentException, InvalidArgumentTypeException } from "../exceptionProcessing/exceptions";
import BaseTypes from "./baseTypes";

class TypeCheckingClass {
    constructor() {
        this._registeredTypes = {}
    }

    Initialize() {
        TypeChecking.RegisterTypes(BaseTypes);
        window["TypeChecking"] = this;
        window["GetType"] = this.GetType;
        window["IsTypeOf"] = this.IsTypeOf;
        window["AsType"] = this.AsType;

        this.DefineExtensionMethod(Object, "GetType",
            function () {
                return TypeChecking.GetType(this);
            });

        this.DefineExtensionMethod(Object, "IsTypeOf",
            function (typeName) {
                return TypeChecking.IsTypeOf(this, typeName);
            });

        this.DefineExtensionMethod(Object, "AsType",
            function (typeName) {
                return TypeChecking.AsType(this, typeName);
            });

        this.DefineExtensionMethod(Object, "Returns",
            function (typeName) {
                return TypeChecking.FuncCheckReturnType(this, typeName);
            });

        this.DefineExtensionMethod(Object, "Args",
            function () {
                var argumentsTypesArray = [];
                for (var i = 0; i < arguments.length; i++) {
                    argumentsTypesArray.push(arguments[i]);
                }
                return TypeChecking.FuncCheckArgumentsTypes(this, argumentsTypesArray);
            });
    }

    DefineExtensionMethod(classObj, methodName, func) {
        if (typeof func !== "function") {
            throw new InvalidArgumentTypeException({ func }, "function");
        }
        classObj.defineProperty(classObj.prototype, methodName, {
            value: func,
            writable: true,
            configurable: true
        });
    }

    // DefineExtensionMethodForAny1(methodName, func) {
    //     this.DefineExtensionMethod(Object, methodName, func);
    //     this.DefineExtensionMethod(String, methodName, func);
    //     this.DefineExtensionMethod(Number, methodName, func);
    //     this.DefineExtensionMethod(Boolean, methodName, func);
    //     this.DefineExtensionMethod(Function, methodName, func);
    // }

    FuncCheckArgumentsTypes(func, argumentsTypesArray) {
        if (typeof func !== "function") {
            throw new InvalidArgumentTypeException({ func }, "function");
        }
        var newFunc = function () {
            var convertedArgs = TypeChecking._ConvertFuncArguments(arguments, argumentsTypesArray);
            if (convertedArgs.isError) {
                var wrongArgIndex = convertedArgs.argIndex;

                throw new FunctionArgumentException(
                    arguments,
                    argumentsTypesArray,
                    wrongArgIndex,
                    this,
                    func
                );
            }
            var res = func.apply(null, convertedArgs);
            return res;
        }
        return newFunc;
    }

    FuncCheckReturnType(func, returnTypeName) {
        if (typeof func !== "function") {
            throw new InvalidArgumentTypeException({ func }, "function");
        }
        var nonGenericType = TypeChecking._GetNonGenericTypeFromTypeStr(returnTypeName);
        var genericType = TypeChecking._GetGenericTypeFromTypeStr(returnTypeName);
        var isGeneric = TypeChecking._IsGenericTypeFromStr(returnTypeName);

        if (nonGenericType == "Promise") {
            var asyncFunc = async function () {
                var promise = func.apply(null, arguments);
                promise = TypeChecking.AsType(promise, returnTypeName);

                var res = await promise;
                if (isGeneric) {
                    res = TypeChecking.AsType(res, genericType);
                } else {
                    res = TypeChecking.AsType(res, "object?");
                }
                return res;
            }
            return asyncFunc;
        }
        else {
            var syncFunc = function () {
                var res = func.apply(null, arguments);
                res = TypeChecking.AsType(res, returnTypeName);
                return res;
            }
            return syncFunc;
        }
    }

    Func(argumentsTypesArray, returnTypeName, func) {
        if (typeof (returnTypeName) === 'function') {
            func = returnTypeName;
            returnTypeName = "undefined";
        }

        var nonGenericType = TypeChecking._GetNonGenericTypeFromTypeStr(returnTypeName);
        var genericType = TypeChecking._GetGenericTypeFromTypeStr(returnTypeName);
        var isGeneric = TypeChecking._IsGenericTypeFromStr(returnTypeName);

        if (nonGenericType == "Promise") {
            var asyncFunc = async function () {
                var args = TypeChecking._ConvertFuncArguments(arguments, argumentsTypesArray);

                var promise = func.apply(null, args);
                promise = TypeChecking.AsType(promise, returnTypeName);

                var res = await promise;
                if (isGeneric) {
                    res = TypeChecking.AsType(res, genericType);
                } else {
                    res = TypeChecking.AsType(res, "object?");
                }
                return res;
            }
            return asyncFunc;
        }
        else {
            var syncFunc = function () {
                var args = TypeChecking._ConvertFuncArguments(arguments, argumentsTypesArray);

                var res = func.apply(null, args);
                res = TypeChecking.AsType(res, returnTypeName);
                return res;
            }
            return syncFunc;
        }

    }

    RegisterTypes(typeDefinitionsArray) {
        for (var i = 0; i < typeDefinitionsArray.length; i++) {
            this.RegisterType(typeDefinitionsArray[i]);
        }
    }

    RegisterType(typeDefinition) {
        if (typeof (typeDefinition.TypeName) === 'string' && typeDefinition.TypeName.length > 0) {
            this._registeredTypes[typeDefinition.TypeName] = typeDefinition;
            if (!window["Types"]) {
                window["Types"] = {};
            }
            window.Types[typeDefinition.TypeName] = typeDefinition.TypeName;
        }
        else {
            throw "Can't register type.";
        }
    }

    IsTypeOf(obj, typeName) {
        var objType = this.GetType(obj);

        //Check if value null and type is nullable
        var isNullable = this.IsNullableType(typeName);
        if ((obj === undefined || obj === null) && isNullable) {
            return true;
        }
        if (isNullable) {
            typeName = typeName.substring(0, typeName.length - 1);
        }

        //Check if TypeName match.
        var isGeneric = this._IsGenericTypeFromStr(objType);
        if (isGeneric) {
            var nonGenericType = this._GetGenericTypeFromTypeStr(objType);
            if (nonGenericType === typeName)
                return true;
        }
        else {
            if (objType === typeName)
                return true;
        }
        return false;
    }

    AsType(obj, typeName) {
        var origTypeName = typeName;

        //Check if null and nullable
        var isNullable = this.IsNullableType(typeName);
        if ((obj === undefined || obj === null)) {
            if (isNullable)
                return obj;
            else
                throw "Object '" + obj + "' value can't be converted to type '" + origTypeName + "'";
        }
        if (isNullable) {
            typeName = typeName.substring(0, typeName.length - 1);
        }

        //Wrap structs
        if (typeof (obj) === 'number') {
            obj = new Number(obj);
        }
        else if (typeof (obj) === 'string') {
            obj = new String(obj);
        }

        //Search for typeDefinition
        var typeDefinition = null;
        var isGeneric = this._IsGenericTypeFromStr(typeName);
        if (isGeneric) {
            var nonGenericType = this._GetNonGenericTypeFromTypeStr(typeName);
            typeDefinition = this._registeredTypes[nonGenericType];
        }
        else {
            typeDefinition = this._registeredTypes[typeName];
        }

        //Validate by type definition
        if (!typeDefinition) {
            //throw "Type '" + origTypeName + "' not recognized.";
        }
        else if (!typeDefinition.Check(obj)) {
            throw "Object '" + obj + "' can't be casted to type '" + origTypeName + "'.";
        }

        if (obj && (typeof (obj) !== 'boolean' || typeof (obj) === 'string'))
            obj.__typeName = typeName;
        return obj;
    }

    GetType(obj) {
        try {
            if (obj === undefined || obj === null) {
                return "undefined";
            }
            else {
                if (typeof (obj["__typeName"]) === 'string' && obj.__typeName.length > 0) {
                    return obj.__typeName;
                }
                else {
                    return typeof (obj);
                }
            }
        }
        catch (ex) {
            return "object?";
        }
    }

    IsNullable(obj) {
        this.IsNullableType(this.GetType(obj));
    }

    IsNullableType(typeName) {
        return typeName === 'undefined' || typeName[typeName.length - 1] == '?';
    }

    _ConvertFuncArguments(args, argumentsTypesArray) {
        for (var i = 0; i < argumentsTypesArray.length; i++) {
            try {
                args[i] = TypeChecking.AsType(args[i], argumentsTypesArray[i]);
            } catch (ex) {
                return {
                    isError: true,
                    argIndex: i
                };
            }
        }
        return args;
    }

    _IsGenericTypeFromStr(typeName) {
        return typeName.includes("<") && typeName.includes(">");
    }

    _GetGenericTypeFromTypeStr(typeName) {
        if (!this._IsGenericTypeFromStr(typeName))
            return typeName;
        var type = typeName
            .replace("<", "###")
            .replace(">", "###")
            .split("###")[1];
        return type;
    }

    _GetNonGenericTypeFromTypeStr(typeName) {
        if (!this._IsGenericTypeFromStr(typeName))
            return typeName;
        var type = typeName
            .replace("<", "###")
            .replace(">", "###")
            .split("###")[0];
        return type;
    }

    _isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]'
    }

    _isPromise(value) {
        return (value + "") === "[object Promise]";
    }

    _isString(value) {
        if (typeof (value) === 'string')
            return true;
        if (value["charCodeAt"])
            return true;
        return false;
    }

    _isBoolean(value) {
        if (this._isString(value))
            return false;
        return (value + "") === "true" || (value + "") === "false";
    }

    _isNumber(value) {
        if (this._isBoolean(value))
            return false;
        if (typeof (value + 1) !== 'number')
            return false;
        if (Number.isNaN(value))
            return false;
        return true;
    }

}

var TypeChecking = new TypeCheckingClass();
TypeChecking.Initialize();

export default TypeChecking;