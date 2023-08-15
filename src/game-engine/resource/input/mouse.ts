import { Res } from "..";
import { Event } from "../event";
import { Vect2 } from "../../math/vect";

// function debounce_leading(func: (...args: any[]) => any, timeout = 100) {
//     let timer: number | undefined;
//     return (...args: any[]) => {
//         if (!timer) {
//             func.apply(null, args);
//         }
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             timer = undefined;
//         }, timeout);
//     };
// }
type MouseEvents = {
    JustPressed: boolean;
    MouseMove: boolean,
    MouseDown: boolean,
    MouseUp: boolean,
    DblClick: boolean,
}

export default class Mouse extends Event<MouseEvents> implements Res<typeof Mouse> {
    get just_pressed(): boolean {
        return this.#just_pressed
    }
    get pressed(): boolean {
        return this.#pressed
    }

    get held(): boolean {
        return this.#held
    }

    get position(): Vect2 {
        return this.#position;
    }

    get x(): number {
        return this.#position.x;
    }

    get y(): number {
        return this.#position.y;
    }

    #position = new Vect2(0, 0);
    #just_pressed = false;
    #pressed = false;
    #held = false;
    static readonly engine_type = 'Res';
    static readonly type = 'Mouse';
    static #instance: Mouse;
    static Instance(): Mouse {
        if (!Mouse.#instance) {
            Mouse.#instance = new Mouse();
        }
        return Mouse.#instance;
    }

    private constructor() {
        super('Mouse', {
            MouseMove: false,
            MouseDown: false,
            MouseUp: false,
            DblClick: false,
            JustPressed: false
        });
        window.addEventListener('mousemove', this.#mousemove.bind(this))
        window.addEventListener('mousedown', this.#mousedown.bind(this))
        window.addEventListener('mouseup', this.#mouseup.bind(this))
        window.addEventListener('dblclick', this.#dblclick.bind(this))
    }

    // on_mousemove(fn: () => void) {
    //     return this.subscribe('Mousemove', fn)
    // }

    // on_mousedown(fn: () => void) {
    //     return this.subscribe('Mousedown', fn)
    // }

    // on_mouseup(fn: () => void) {
    //     return this.subscribe('Mouseup', fn)
    // }

    // on_mouseheld(fn: () => void) {
    //     return this.subscribe('Mouseheld', fn)
    // }

    #mousemove(e: MouseEvent) {
        this.#position.x = e.screenX;
        this.#position.y = e.screenY;
        this.emit('MouseMove', true)
    }

    #dblclick() {
        this.emit('DblClick', true)
    }

    #mousedown() {
        this.emit('JustPressed', true)
        if (!this.#pressed) {
            this.emit('MouseDown', true)
            this.#pressed = true;
        }
    }

    #mouseup() {
        this.#pressed = false;
        this.#held = false;
        this.emit('MouseUp', true);
    }

    cleanup() {
        window.removeEventListener('dblclick', this.#dblclick.bind(this));
        window.removeEventListener('mousemove', this.#mousemove.bind(this));
        window.removeEventListener('mousedown', this.#mousedown.bind(this))
        window.removeEventListener('mouseup', this.#mouseup.bind(this))
    }
}
