import { Func } from "./typeChecking/importer"

class KeyValueStorageClass {

    set = Func(["string", "object?"],
        (key, value) => {
            var json = JSON.stringify(value);
            localStorage.setItem(key, json);
        })

    containsKey = Func(["string"], "boolean",
        (key) => {
            return localStorage.getItem(key) != null;
        })

    tryGet = Func(["string"], "object?",
        (key) => {
            if (!this.containsKey(key))
                return null;
            var json = localStorage.getItem(key);
            return JSON.parse(json);
        })

    get = Func(["string"], "object?",
        (key) => {
            if (!this.containsKey(key)){
                throw "Not contains key '" + key + "'.";
            }
            var json = localStorage.getItem(key);
            return JSON.parse(json);
        })

    remove = Func(["string"],
        (key) => {
            localStorage.removeItem(key);
        })
}

var KeyValueStorage = new KeyValueStorageClass();
export default KeyValueStorage;