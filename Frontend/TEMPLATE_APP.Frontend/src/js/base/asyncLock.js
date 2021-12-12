
var asyncLock = {
    async asyncLock(func, scopeName) {
        var w = window;
        var key = "_asyncLockScope_" + scopeName;
        try {
            var promise = sleep(1);
            while (isPromise(promise)) {
                await promise;
                var promise = w[key];
            }

            var newPromise = func();
            w[key] = newPromise;
            await newPromise;
            w[key] = null;
        } catch (ex) {
            w[key] = null;
            throw ex;
        }
    },

    isPromise(v) {
        return v && typeof v === 'object' && typeof v.then === 'function';
    }
}
export default asyncLock;