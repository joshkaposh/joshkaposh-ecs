import type { Commands } from "../game-engine";
import App, { with_params } from "../game-engine";
import DefaultPlugin from "../game-engine/plugin/default_plugins.plugin.ts";
import { ResType } from "../game-engine/resource";
import { Event, EventDef } from "../game-engine/resource/event";

class Box {
    readonly type = 'Box';
    readonly engine_type = 'Entity';
    checked = false;
    num: number;
    constructor(num: number) {
        this.num = num;
    }
}
type Events = EventDef<{
    AdvanceTurn: boolean;
}>

class MyEvents extends Event<Events> {
    static readonly type = 'MyEvents';
    static readonly engine_type = 'Res'
    static #instance: MyEvents;
    static Instance() {
        if (!MyEvents.#instance) {
            MyEvents.#instance = new MyEvents();
        }
        return MyEvents.#instance;
    }
    private constructor() {
        super({
            AdvanceTurn: null
        })
    }

}

function spawn_boxes(commands: Commands) {
    const arr = []
    for (let i = 0; i < 9; i++) {
        arr.push(new Box(i))
    }
    commands.spawn(...arr)
}

function tictactoe(app: App) {
    app
        .insert_plugin(DefaultPlugin)
        .insert_entity(Box)
        // .insert_event(MyEvents)
        .insert_resource(MyEvents)
        .add_startup_system((app) => with_params(spawn_boxes, app.commands))
}

export default function client(app: App) {
    tictactoe(app)
}