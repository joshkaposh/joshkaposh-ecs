export type Events<EvObj = { [key: string]: any }> = {
    [K in keyof EvObj]: EvObj[K] | null;
}
export type OnlyStringKey<T = {}, K = keyof T> = K extends string ? K : never;

export class Event<Evs extends Events<{ [key: string]: any }>> {
    events: Map<string, any>;
    readonly type: string;
    constructor(name: string, events: Evs) {
        this.type = name;
        this.events = new Map(Object.entries(events));
    }

    flush() {
        for (const key of this.events.keys()) {
            this.events.set(key, null);
        }
    }

    emit<E extends keyof Evs>(event: E, data: Evs[E]) {
        this.events.set(event as string, data);
    }
}
