(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const proxyCache = new WeakMap();
    exports.compile = (expression) => {
        const fn = new Function('scope', `with (scope) { return ${expression}; }`);
        return (scope) => {
            if (!proxyCache.has(scope)) {
                proxyCache.set(scope, new Proxy(scope, {
                    has: () => true,
                    get: (target, key) => {
                        if (key === Symbol.unscopables || typeof key !== 'string') {
                            return undefined;
                        }
                        return target[key];
                    }
                }));
            }
            return fn(proxyCache.get(scope));
        };
    };
});
