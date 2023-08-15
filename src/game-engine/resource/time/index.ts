import type { Res } from '../'
export default class Time implements Res<typeof Time> {
    get delta() {
        return this.#delta;
    }

    get totalElapsedDelta() {
        return this.#totalDelta;
    }

    get fps(): number {
        if (this.#delta > 0) {
            return 1 / this.#delta
        } else return 0
    }

    #delta!: number;
    #totalDelta!: number
    #lastFrameTime!: number;

    static readonly engine_type = 'Res';
    static readonly type = 'Time';

    private static instance: Time;
    private constructor() { }
    public static Instance(): Time {
        if (!Time.instance) {
            Time.instance = new Time();
        }

        return Time.instance;
    }

    data() {
        return this
    }

    step(): number {
        const now = performance.now()
        if (!this.#lastFrameTime) {
            this.#lastFrameTime = now;
            this.#totalDelta = 0;
            return this.#lastFrameTime;
        }
        const elapsed = (now - this.#lastFrameTime) / 1000;
        this.#delta = elapsed
        this.#lastFrameTime = now;
        this.#totalDelta += elapsed;
        return elapsed
    }
}