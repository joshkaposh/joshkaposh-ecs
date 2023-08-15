import type { Type, Instance } from '../index'
export type DistributeToArray<T> = T extends T ? T[] : never;

export type Entity<T = string> = new (...args: any) => Type<T>;
// export type Instance<T extends Entity> = InstanceType<T>
export type EntityTypes<T = string> = Record<string, Entity<T>>
export type EntityDict<T extends string> = Record<string, Instance<Entity<T>>[]>

export default class Entities<Types extends EntityTypes, Dict extends EntityDict<string>> {
    types!: Types;
    dict!: Dict;

    constructor() {

    }

    init(types: Types) {
        this.types = types;
        const keys = Object.keys(types);
        const dict: EntityDict<string> = {};
        for (let i = 0; i < keys.length; i++) {
            dict[keys[i]] = [];
        }
        this.dict = dict as Dict;
    }

    add<K extends Types[keyof Types]>(...entity: DistributeToArray<Instance<K>>): void {
        const type = entity[0].type
        for (let i = 0; i < entity.length; i++) {
            this.dict[type].push(entity[i]);
        }
    }

    remove() {

    }

}