let TypeChecking = {
    Func(returnTypeName, func) {

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

    },

    RegisterTypes(typeDefinitionsArray) {
        for (var i = 0; i < typeDefinitionsArray.length; i++) {
            this.RegisterType(typeDefinitionsArray[i]);
        }
    },

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
    },

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
    },

    AsType(obj, typeName) {
        var origTypeName = typeName;

        //Check if null and nullable
        var isNullable = this.IsNullableType(typeName);
        if ((obj === undefined || obj === null) && isNullable) {
            return obj;
        }
        if (isNullable) {
            typeName = typeName.substring(0, typeName.length - 1);
        }

        //Wrap structs
        if (typeof (obj) === 'number') {
            obj = new Number(obj);
        }
        else if (typeof (obj) === 'boolean') {
            obj = new Boolean(obj);
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
            throw "Type '" + origTypeName + "' not recognized.";
        }
        else if (!typeDefinition.Check(obj)) {
            throw "Object '"+obj+"' can't be casted to type '" + origTypeName + "'.";
        }

        if (obj)
            obj.TypeName = typeName;
        return obj;
    },

    GetType(obj) {
        try {
            if (obj === undefined || obj === null) {
                return "undefined";
            }
            else {
                if (typeof (obj["TypeName"]) === 'string' && obj.TypeName.length > 0) {
                    return obj.TypeName;
                }
                else {
                    return typeof (obj);
                }
            }
        }
        catch (ex) {
            return "object?";
        }
    },

    IsNullable(obj) {
        this.IsNullableType(this.GetType(obj));
    },

    IsNullableType(typeName) {
        return typeName[typeName.length - 1] == '?';
    },

    _registeredTypes: {},

    _IsGenericTypeFromStr(typeName) {
        return typeName.includes("<") && typeName.includes(">");
    },

    _GetGenericTypeFromTypeStr(typeName) {
        if (!this._IsGenericTypeFromStr(typeName))
            return typeName;
        var type = typeName
            .replace("<", "###")
            .replace(">", "###")
            .split("###")[1];
        return type;
    },

    _GetNonGenericTypeFromTypeStr(typeName) {
        if (!this._IsGenericTypeFromStr(typeName))
            return typeName;
        var type = typeName
            .replace("<", "###")
            .replace(">", "###")
            .split("###")[0];
        return type;
    },

    _isPromise(value) {
        return (value + "") === "[object Promise]";
    },

    _isString(value) {
        if (typeof (value) === 'string')
            return true;
        if (value["charCodeAt"])
            return true;
        return false;
    },

    _isBoolean(value) {
        if (this._isString(value))
            return false;
        return (value + "") === "true" || (value + "") === "false";
    },

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
export default TypeChecking;