import TypeChecking from "./typeChecking";
import BaseTypes from "./baseTypes";

TypeChecking.RegisterTypes(BaseTypes);
let Types = window.Types;
window["TypeChecking"] = TypeChecking;

let GetType = TypeChecking.GetType
window["GetType"] = GetType;

let IsTypeOf = TypeChecking.IsTypeOf
window["IsTypeOf"] = IsTypeOf;

let AsType = TypeChecking.AsType
window["AsType"] = AsType;

let Func = TypeChecking.Func
window["Func"] = Func;



TypeChecking.DefineExtensionMethod(Object, "GetType",
    function () {
        return TypeChecking.GetType(this);
    });




export { TypeChecking, Types, GetType, AsType, Func, IsTypeOf }