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

export { Exception, InvalidArgumentTypeException };