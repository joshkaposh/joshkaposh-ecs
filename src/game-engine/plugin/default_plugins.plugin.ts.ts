import type { Plugin } from ".";
import type { Res } from "../resource";
import App, { Runner, with_params } from "..";
import Time from "../resource/time";
import Keyboard from "../resource/input/keyboard";
import Mouse from "../resource/input/mouse";
import Viewport from "../resource/viewport";

function time_step(time: Res<typeof Time>) {
    time.step();
}

function log_key(keyboard: Res<typeof Keyboard>) {
    if (keyboard.lastKey) {
        console.log(keyboard.lastKey);

    }
}

function log_mouse(mouse: Res<typeof Mouse>) {
    if (mouse.just_pressed) {
        console.log('Mouse was just pressed!');
    } else if (mouse.pressed) {
        console.log('Mouse is pressed!');

    }
}

function runner(update: () => void): Runner {
    let anId: number
    function loop() {
        update()
        anId = requestAnimationFrame(loop)
    }

    return {
        run() {
            loop()
        },
        exit() {
            cancelAnimationFrame(anId)
        },

    }
}

function render() { }

function init_viewport(viewport: Viewport) {
    console.log(viewport);
}

export default class DefaultPlugin implements Plugin {
    build(app: App): App {
        return app.insert_resource(Time)
            .insert_resource(Keyboard)
            .insert_resource(Mouse)
            .insert_resource(Viewport)
            .add_startup_system((app) => with_params(init_viewport, app.get_resource(Viewport)))
            .add_system((app) => with_params(time_step, app.get_resource(Time)))
            .add_system(
                (app) => with_params(log_key, app.get_resource(Keyboard))
            )
            .add_system(
                (app) => with_params(log_mouse, app.get_resource(Mouse))
            )
            .add_system(() => render)
            .set_runner(runner)
    };
}