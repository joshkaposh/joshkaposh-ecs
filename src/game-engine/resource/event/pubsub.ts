export type SubscribeFn = (data?: any) => void
export type Handler = SubscribeFn | [SubscribeFn, any]

export default class PubSub<T extends string> {
    #lookup_table: { [key: string]: number } = {};
    #events: [string, Handler[]][] = []

    constructor(events: string[] | { [key: string]: number }) {
        if (Array.isArray(events)) {
            for (let i = 0; i < events.length; i++) {
                this.#events.push([events[i], []])
                this.#lookup_table[events[i]] = i
            }
        } else {
            const keys = Object.keys(events);
            for (let i = 0; i < keys.length; i++) {
                this.#events.push([keys[i], []])
                this.#lookup_table[keys[i]] = events[keys[i]]
            }
        }
    }

    logEvents() {
        console.log(this.#events);

    }

    notify<E extends T>(event: E, data?: any) {
        const subs = this.#lookup(event)
        for (let i = 0; i < subs.length; i++) {
            if (!Array.isArray(subs[i])) {
                //@ts-ignore
                subs[i](data)
                //@ts-ignore
            } else if (data === subs[i][1]) {
                //@ts-ignore
                subs[i][0](data)
            }
        }
    }

    subscribe<E extends T>(eventType: E, handler: SubscribeFn | [SubscribeFn, any]) {
        this.#lookup(eventType).push(handler)
        return () => this.#unsubscribe(eventType, handler)
    }

    disposeSubscribers() {
        const events = Object.keys(this.#lookup_table);
        for (let i = 0; i < events.length; i++) {
            const subs = this.#lookup(events[i])
            subs.splice(0, subs.length);
        }

    }

    #unsubscribe(event: string, handler: SubscribeFn | [SubscribeFn, any]) {
        const subscribers = this.#lookup(event)
        for (let i = subscribers.length - 1; i >= 0; i--) {
            if (subscribers[i] === handler) {
                subscribers.splice(i, 1)
            }
        }
    }

    #lookup(eventType: string) {
        return this.#events[this.#lookup_table[eventType]][1]
    }

}
