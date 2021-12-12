let TypeChecking = {
    Func(returnTypeName, func) {
        var resFunc = function () {
            var res = func();
            res = TypeChecking.AsType(res, returnTypeName);
            return res;
        }
        return resFunc;
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
        var origTypeName = typeName;
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
        if (objType === typeName)
            return true;
        var isGeneric = this.IsGenericType(objType);
        console.log(objType)
        var nonGenericType = null;
        if (isGeneric) {
            nonGenericType = this.GetNonGenericType(obj);
            if (nonGenericType === typeName)
                return true;
        }

        //Check by typeDefinition
        var typeDefinition = null;
        if (isGeneric) {
            typeDefinition = this._registeredTypes[nonGenericType];
            console.log(nonGenericType)
        }
        else{
            typeDefinition = this._registeredTypes[typeName];  
            console.log("@"+typeName)
        }

        if (typeDefinition) {
            return typeDefinition.Check(obj);
        }
        else {
            console.warn("TypeChecking.IsTypeOf exception, type '" + origTypeName + "' not recognized.");
            return false;
        }
    },

    AsType(obj, typeName) {
        if (typeof (obj) === 'number') {
            obj = new Number(obj);
        }
        else if (typeof (obj) === 'boolean') {
            obj = new Boolean(obj);
        }
        else if (typeof (obj) === 'string') {
            obj = new String(obj);
        }

        if (!this.IsTypeOf(obj, typeName)) {
            throw "Object can't be casted to type '" + typeName + "'.";
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

    GetGenericType(obj) {
        var typeName = this.GetType(obj);
        if (!this.IsGenericType(typeName)) {
            throw "Can use this only for generic types";
        }
        var type = typeName
            .replace("<", "###")
            .replace(">", "###")
            .split("###")[1];
        return type;
    },

    GetNonGenericType(obj) {
        var typeName = this.GetType(obj);
        if (!this.IsGenericType(typeName)) {
            throw "Can use this only for generic types";
        }
        var type = typeName
            .replace("<", "###")
            .replace(">", "###")
            .split("###")[0];
        return type;
    },

    IsNullable(obj) {
        this.IsNullableType(this.GetType(obj));
    },

    IsGenericType(typeName) {
        return typeName.includes("<") && typeName.includes(">");
    },

    IsNullableType(typeName) {
        return typeName[typeName.length - 1] == '?';
    },

    _registeredTypes: {},

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