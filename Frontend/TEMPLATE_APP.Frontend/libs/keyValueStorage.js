import BaseTypes from "./typeChecking/baseTypes";

class KeyValueStorageClass {

    set = ((key, value) => {
        var json = JSON.stringify(value);
        localStorage.setItem(key, json);
    })
        .Args("string", BaseTypes.Object)

    containsKey = ((key) => {
        return localStorage.getItem(key) != null;
    })
        .Args("string")
        .Returns("boolean")

    tryGet = ((key) => {
        if (!this.containsKey(key))
            return null;
        var json = localStorage.getItem(key);
        return JSON.parse(json);
    })
        .Args("string")
        .Returns("object?")

    get = ((key) => {
        if (!this.containsKey(key)) {
            throw "Not contains key '" + key + "'.";
        }
        var json = localStorage.getItem(key);
        return JSON.parse(json);
    })
        .Args("string")
        .Returns("object")

    remove = ((key) => {
        localStorage.removeItem(key);
    })
        .Args("string")
}

var KeyValueStorage = new KeyValueStorageClass();
export default KeyValueStorage;