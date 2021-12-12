import TypeChecking from "./typeChecking";
import BaseTypes from "./baseTypes";

TypeChecking.RegisterTypes(BaseTypes);
let Types = window.Types;
window["TypeChecking"] = TypeChecking;

let GetType = TypeChecking.GetType
window["GetType"] = GetType;

let AsType = TypeChecking.AsType
window["AsType"] = AsType;

let Func = TypeChecking.Func
window["Func"] = Func;

// Object.prototype.GetType = function () {
//     return TypeChecking.GetType(this);
// }

// Object.prototype.AsType = function (typeName) {
//     return TypeChecking.AsType(this, typeName);
// }

export { TypeChecking, Types, GetType, AsType, Func }