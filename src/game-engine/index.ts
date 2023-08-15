import type { DistributeToArray } from './entity';
import type { SystemFn, SystemDef } from './system';
import { Entity } from './entity';
import { Res, ResType } from './resource';
import CONSTS from '../../consts.json'
import { Plugin } from './plugin';
import { Event, Events, OnlyStringKey } from './resource/event';
export type EngineTypeName = 'Res' | 'Entity' | 'System';
// type EngineType<N extends EngineTypeName, T = N extends 'Res' ? ResType : N extends 'Entity' ? Entity : SystemFn> = T
// type R = EngineType<'Res'>
// type S = EngineType<'System'>
// type E = EngineType<'Entity'>


export function define_object(type: EngineTypeName): [string] {
    return [`${CONSTS.root}/${CONSTS[type]}`]
}
export type Query<E extends Entity> = DistributeToArray<Instance<E>>
export type Commands = {
    spawn<E extends Entity>(...entity: Query<E>): void
    despawn<E extends Entity>(...entity: Query<E>): void
}

export type Runner = {
    run: () => void;
    exit: () => void;
}
export type RunnerSetter = (update: () => void) => Runner;
export type Type<T = string, EType = Omit<EngineTypeName, 'System'>> = {
    readonly type: T
    readonly engine_type: EType
}

export type Class<T = new (...args: any[]) => Type> = T
export type Instance<T extends Class> = InstanceType<T>

export type primitive = string | number | boolean | undefined | null
export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}
export type DeepReadonly<T> = T extends primitive ? T : DeepReadonlyObject<T>
// type Distribute<T> = T extends T ? T : never;

type EventEnum<TEvent = string, TData = unknown> = Map<TEvent, TData>

function TODO(...args: any[]) { return args; }

export function type<T extends unknown>(value: T): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | 'null' | 'class' | (string & {}) {
    if (value === null) {
        return "null";
    }
    const baseType = typeof value;
    // Primitive types
    if (!["object", "function"].includes(baseType)) {
        return baseType;
    }

    // Symbol.toStringTag often specifies the "display name" of the
    // object's class. It's used in Object.prototype.toString().
    // @ts-ignore
    const tag = value[Symbol.toStringTag]
    if (typeof tag === "string") {
        return tag;
    }

    // If it's a function whose source code starts with the "class" keyword
    if (
        baseType === "function"
    ) {
        const src = Function.prototype.toString.call(value)
        if (src.startsWith('class')) {
            return src.slice(0, src.indexOf('{')).split(' ')[1] || 'class';
        }
    }

    // The name of the constructor; for example `Array`, `GeneratorFunction`,
    // `Number`, `String`, `Boolean` or `MyCustomClass`
    const className = value!.constructor.name;
    if (typeof className === "string" && className !== "") {
        return className;
    }

    // At this point there's no robust way to get the type of value,
    // so we use the base implementation.
    return baseType;
}
export function with_params<Fn extends SystemFn, Params extends Parameters<Fn>>(fn: Fn, ...params: Params): [Fn, Params] {
    return [fn, params satisfies Params]
}
export function before<Fn extends SystemFn, Params extends Parameters<Fn>>(this: App, other: SystemFn, system: Fn, ...params: Params) {
    // console.log('Before::', this.systems[other.name])
    TODO(other, system, params)
}
export function after<Fn extends SystemFn, Params extends Parameters<Fn>>(other: SystemFn, system: Fn, ...params: Params) {
    TODO(other, system, params)
}
export function run_if<Fn extends SystemFn, Params extends Parameters<Fn>>(other: SystemFn, system: Fn, ...params: Params) {
    TODO(other, system, params)
}

export function create_system(this: App) {
    console.log(this)
}
// type CreateResult<Fn extends SystemFn, Params = Parameters<Fn>> = Parameters<Fn>['length'] extends 0 ? Fn : [
//     system: Fn,
//     condition: {
//         run_order: 'AFTER' | 'BEFORE' | 'RUN_IF';
//         deps: string[];
//     } | (() => boolean),
//     params: Params,

// ]

// type E = EventOf<typeof CustomEvent>
export type AppStates = Events<{
    Init: boolean;
    Update: boolean;
    Exit: boolean;
}>

export class AppEvents extends Event<AppStates> {
    constructor() {
        super('AppEvents', {
            Init: null,
            Update: null,
            Exit: null,

        })
    }
}

// type T = typeof AppEvents['prototype']['events']

export type EditorLoad = {
    types: {
        startup_system: {
            [key: string]: SystemDef<SystemFn>
        }
        system: {
            [key: string]: SystemDef<SystemFn>
        }
        resource: {
            [key: string]: ResType
        };
        event: {
            [key: string]: EventEnum
        }
        entity: {
            [key: string]: Entity
        };
    }
}

export default class App {
    #startup_systems: {
        [key: string]: SystemDef<SystemFn>
    }
    #systems: {
        [key: string]: SystemDef<SystemFn>
    }
    #resources: {
        [key: string]: ResType
    };
    #events: {
        [key: string]: EventEnum
    }

    #entity_types: {
        [key: string]: Entity
    };

    #entities: {
        [key: string]: Instance<Entity>[]
    };

    #commands: Commands = {
        spawn: this.spawn.bind(this),
        despawn: this.despawn.bind(this)
    }

    get commands(): Commands {
        return this.#commands
    }

    get systems(): {
        [key: string]: SystemDef<SystemFn>
    } {
        return this.#systems;
    }
    get resources(): {
        [key: string]: ResType
    } {
        return this.#resources;
    }
    get entities(): {
        [key: string]: Instance<Entity>[]
    } {
        return this.#entities;
    }
    get entity_types(): {
        [key: string]: Entity
    } {
        return this.#entity_types
    }
    #runner?: Runner;

    constructor() {
        this.#resources = {};
        this.#startup_systems = {}
        this.#systems = {};
        this.#entity_types = {}
        this.#entities = {};
        this.#events = {};
    }

    run() {
        this.#call_startup_systems();
        console.log(this.#entities);

        if (this.#runner) {
            this.#runner.run()
        } else {
            this.update();
        }
    }

    set_runner(runner: RunnerSetter) {
        this.#runner = runner(this.update.bind(this));
        return this;
    }

    *query<T extends Entity>(...type: T[]) {
        console.log('Query::', type)
        function query(): any[] {
            return []
        }
        TODO(query())
        return {
            get mut() {
                return ''
                // return query() as DeepReadonly<>
            }
        }
    }
    get_event<EK extends Events, E extends Event<Events>, K extends OnlyStringKey<EK>>(event: E, type: K) {
        return this.#events[event.type].get(type)
    }

    get_resource<T extends ResType>(type: T): Res<T> {
        // @ts-ignore
        return this.#resources[type.type].Instance();
    }

    insert_plugin<T extends new (...args: any) => Plugin,>(plugin: T): this {
        const p = new plugin();
        p.build(this);
        return this;
    }

    insert_entity<E extends Entity>(entity: E): this {
        this.#entity_types[entity.name] = entity;
        this.#entities[entity.name] = [];

        return this;
    }

    insert_resource<R extends ResType>(resource: R): this {
        this.#resources[resource.type] = resource as any
        return this
    }

    insert_event<E extends ResType>(event: E): this {
        console.log(event);
        return this;
    }

    insert_ui() {

    }

    add_system<CreateFn extends (app: this) => SystemFn | [SystemFn, Parameters<SystemFn>]>(create: CreateFn): this {
        const tup = create(this)
        if (Array.isArray(tup)) {
            this.#systems[tup[0].name] = tup
        } else {
            this.#systems[tup.name] = [tup]
        }
        return this;
    }

    add_startup_system<CreateFn extends (app: this) => SystemFn | [SystemFn, Parameters<SystemFn>]>(create: CreateFn): this {
        const tup = create(this)
        if (Array.isArray(tup)) {
            this.#startup_systems[tup[0].name] = tup
        } else {
            this.#startup_systems[tup.name] = [tup]
        }
        return this
    }

    spawn<E extends Entity>(...entity: DistributeToArray<Instance<E>>): void {

        if (entity.length > 0) {
            const type = entity[0].type;
            for (let i = 0; i < entity.length; i++) {
                this.#entities[type].push(entity[i]);
            }
        }
    }

    despawn<E extends Entity>(...entity: DistributeToArray<Instance<E>>): void {
        TODO(entity)
    }

    update() {
        // called once per frame from runner;
        const systems = Object.values(this.#systems);
        for (let i = 0; i < systems.length; i++) {
            this.#call_system(systems[i])
        }
    }

    #call_startup_systems() {
        // called once at start of run method;
        const systems = Object.values(this.#startup_systems);
        for (let i = 0; i < systems.length; i++) {
            this.#call_system(systems[i])
        }
    }

    #call_system<Tuple extends SystemDef<SystemFn>>(tuple: Tuple) {
        if (Array.isArray(tuple[1])) {
            tuple[0](...tuple[1])
        } else {
            tuple[0](tuple[1])
        }
    }


}
