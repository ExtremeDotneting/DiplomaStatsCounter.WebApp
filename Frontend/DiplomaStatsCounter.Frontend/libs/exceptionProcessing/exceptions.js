class Exception {
    constructor(message, object) {
        this.message = message;
        this.object = object;
    }
}

// Example: new InvalidArgumentTypeException({myArgument}, 'function');
class InvalidArgumentTypeException extends Exception {
    constructor(paramWrapped, requiredType) {
        super();
        var paramName = Object.keys(paramWrapped);
        var paramValue = paramWrapped[paramName];
        var paramType = typeof paramValue;
        this.message = "Parameter '" + paramName + "' type is '" + paramType + "' but must be '" + requiredType + "'.";
        this.message = this.message + "\nValue: " + paramValue;
        this.object = paramWrapped;
    }
}

// Example: new InvalidArgumentTypeException({myArgument}, 'function');
class FunctionArgumentException {
    message = null
    args = null
    argsTypes = null
    wrongArgIndex = null
    owner = null
    func = null

    constructor(args, argsTypes, wrongArgIndex, owner, func) {
        this.message = "Can't convert argument[" + wrongArgIndex + "] : '" + args[wrongArgIndex] + "' to type '" + argsTypes[wrongArgIndex] + "'.";
        this.args = args;
        this.argsTypes = argsTypes;
        this.wrongArgIndex = wrongArgIndex;
        this.owner = owner;
        this.func = func + "";
    }
}

export { Exception, InvalidArgumentTypeException, FunctionArgumentException };