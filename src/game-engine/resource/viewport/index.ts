import { Res } from "..";
import CONSTS from '../../../../consts.json';
function createAndMount(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    // canvas.width = width;
    // canvas.height = height;
    canvas.id = 'canvas'
    document.getElementById(CONSTS.canvas_mount_point)?.appendChild(canvas)
    return canvas;
}

export default class Viewport implements Res<typeof Viewport> {
    // #resolution: [number, number]
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    // set resolution(resolution: [number, number]) {
    //     this.#resolution = resolution
    // }

    // get resolution() {
    //     return this.#resolution;
    // }
    static readonly type = 'Viewport';
    static readonly engine_type = 'Res';

    static Instance(): Viewport {
        if (!Viewport.#instance) {
            Viewport.#instance = new Viewport();
        }
        return Viewport.#instance;
    }
    static #instance: Viewport;

    private constructor() {
        // this.#resolution = [16, 9];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        window.addEventListener('resize', this.resize.bind(this))
        this.canvas = createAndMount();
        this.canvas.width = this.width;
        this.canvas.height = this.height;

    }
    //TODO: cleanup 
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight
    }
}