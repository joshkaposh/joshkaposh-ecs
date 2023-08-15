export type SystemDict = {
    startup: (() => void)[]
    update: (() => void)[]
}

// type SystemParams<S extends SystemFn, Params = Parameters<S>> = 
export type SystemFn<Args = any, Ret = boolean | void> = (...args: Args[]) => Ret;
export type SystemDef<S extends SystemFn> = [system: S, params?: Parameters<S>];

type BaseDef<Fn extends SystemFn, Params extends Parameters<Fn>> = { run: Fn } | { run: Fn; params: Params }

type Def<Fn extends SystemFn, Params extends Parameters<Fn>> = {
    run: Fn;
    params?: Params;
}
type Before<Fn extends SystemFn, Params extends Parameters<Fn>> = Def<Fn, Params> & {
    before: string[];
}

type After<Fn extends SystemFn, Params extends Parameters<Fn>> = Def<Fn, Params> & {
    after: string[];
}

type RunIf<Fn extends SystemFn, Params extends Parameters<Fn>> = Def<Fn, Params> & {
    run_if: string[];
}
function my_sys(hi: string) { }
function other() { }

export function sys<
    Fn extends SystemFn,
    Params extends Parameters<Fn>
>(fn: Fn, ...params: Params extends [undefined] ? never : Params): BaseDef<Fn, Params> {
    if (!params[0]) {
        return { run: fn };
    }
    return {
        run: fn,
        params
    }
}

function toNameArray(array: ((...args: any) => any)[]): string[] {
    const ret: string[] = [];
    for (let i = 0; i < array.length; i++) {
        ret.push(array[i].name);
    }
    return ret;
}

function set_params<S extends SystemFn, D extends Def<S, Parameters<S>>>(ret: D, params: Parameters<S>): D {
    if (!params[0]) {
        return ret;
    }
    ret.params = params
    return ret;
}

export function run_if<Fn extends SystemFn, Params extends Parameters<Fn>>(fn: Fn, condition: SystemFn | SystemFn[], ...params: Params extends [undefined] ? never : Params): RunIf<Fn, Params> {
    const ret: RunIf<Fn, Params> = {
        run: fn,
        run_if: !(Array.isArray(condition)) ? [condition.name] : toNameArray(condition)
    }
    return set_params(ret, params)
}

export function after<Fn extends SystemFn, Params extends Parameters<Fn>>(fn: Fn, after: SystemFn | SystemFn[], ...params: Params extends [undefined] ? never : Params): After<Fn, Params> {
    const ret: After<Fn, Params> = {
        run: fn,
        after: !(Array.isArray(after)) ? [after.name] : toNameArray(after)
    }
    return set_params(ret, params)
}
export function before<Fn extends SystemFn, Params extends Parameters<Fn>>(fn: Fn, before: SystemFn | SystemFn[], ...params: Params extends [undefined] ? never : Params): Before<Fn, Params> {
    const ret: Before<Fn, Params> = {
        run: fn,
        before: !(Array.isArray(before)) ? [before.name] : toNameArray(before)
    }
    return set_params(ret, params)
}

export function add<Fn extends SystemFn, Params extends Parameters<Fn>>(...system: BaseDef<Fn, Params>[]) {
    return system;
}
const objs = add(sys(my_sys, ''), sys(other))
console.log('SYSTEMS', objs)
// before(other, my_sys)
// declare(sys, 'Hi Mom')

type SystemDef2<S extends SystemFn, Params = Parameters<S>> = {
    run: S;
    params: Params extends undefined ? never : Params;
    deps?: any;

} 