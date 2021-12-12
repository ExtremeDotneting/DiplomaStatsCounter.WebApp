import TypeChecking from "./typeChecking";
import BaseTypes from "./baseTypes";

TypeChecking.RegisterTypes(BaseTypes);
let Types = window.Types;
window["TypeChecking"] = TypeChecking;
window["GetType"] = TypeChecking.GetType;
window["AsType"] = TypeChecking.AsType;
window["Func"] = TypeChecking.Func;

export default { TypeChecking, Types }