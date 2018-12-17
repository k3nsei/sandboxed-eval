interface Scope {
    [key: string]: any;
}

const proxyCache: WeakMap<Scope, any> = new WeakMap();

export const compile = (expression: string): (scope: Scope) => any => {
    const fn = new Function('scope', `with (scope) { return ${expression}; }`);
    return (scope: Scope): any => {
        if (!proxyCache.has(scope)) {
            proxyCache.set(
                scope,
                new Proxy(scope, {
                    has: () => true,
                    get: (target: Scope, key: unknown) => {
                        if (key === Symbol.unscopables || typeof key !== 'string') {
                            return undefined;
                        }
                        return target[key as string];
                    }
                })
            );
        }
        return fn(proxyCache.get(scope));
    };
};
