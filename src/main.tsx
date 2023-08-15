import { render } from 'solid-js/web'
import { Component, createSignal, onMount } from 'solid-js';
import CONSTS from '../consts.json';
import App from './game-engine';
import client from './client';
// import TicTacToe from './components/vanilla-ui';
import { create_file } from './io';
import Editor from './editor';
import './assets/style.css';
import './assets/game-engine.css';

const GameEngine: Component<{
    app: App
}> = (props) => {
    const [isRunning, setIsRunning] = createSignal(false)
    return <div id='game-engine'>
        <div id={CONSTS.canvas_mount_point}></div>
        <button onClick={() => {
            create_file('himom', 'System')
        }}>Send Event</button>
        <button tabIndex={2} onClick={(e) => {
            e.preventDefault();
            if (isRunning()) return setIsRunning(false);
            setIsRunning(true)
            props.app.run();
            return;
        }}>
            <h2>{isRunning() ? 'Stop' : 'Start'}</h2>
        </button>
    </div>
}

const UI = () => {
    const app = new App()
    onMount(() => {
        client(app);

    })

    return <div id='app'>
        <GameEngine app={app} />
        <Editor app={app} />
    </div>
}

render(() => <UI />, document.getElementById('root')!)

