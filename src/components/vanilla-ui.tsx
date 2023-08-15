import { Component, Index, Match, Switch, createSignal } from 'solid-js';
import '../assets/tic-tac-toe.css';
import VanillaGame from '../vanilla';

const Box: Component<{
    game: VanillaGame;
    i: number;
    update: () => void;
}> = (props) => {

    const [text, setText] = createSignal<string | null>(null)
    const [hasPlaced, setHasPlaced] = createSignal(false)

    function update(symbol: string) {
        setHasPlaced(true);
        setText(symbol)
    }

    function click() {
        if (hasPlaced()) {
            return;
        }
        const sym = props.game.turnSymbol
        props.game.handleTurn(props.i)
        props.update();
        update(sym);

    }
    return <li class='box' onClick={() => {
        click();
    }}>{props.i}: {text()}</li>
}

const TicTacToe: Component = () => {
    const [game, setGame] = createSignal(new VanillaGame())

    const [turn, setTurn] = createSignal<number>(0);
    const [state, setState] = createSignal<VanillaGame['state']>('play');

    function reset() {
        setGame(new VanillaGame())
        setTurn(game().turn);
        setState('playing');
    }

    function update() {
        setTurn(game().turn)
        if (game().state === 'play again') {
            setState('play again')
        }
    }

    return <section id='tic-tac-toe'>
        <Switch>
            <Match when={state() === 'playing'}>
                <h2>Turn {turn()}</h2>
                <ol id='boxes'>
                    <Index each={game().boxes}>{(_, i) => {
                        return <Box
                            update={update}
                            i={i}
                            game={game()}
                        />
                    }}</Index>
                </ol>
            </Match>
            <Match when={state() === 'play again'}>
                <button onClick={(e) => {
                    e.preventDefault();
                    reset();
                }} textContent='Play Again' />
            </Match>
            <Match when={state() === 'play'}>
                <button onClick={() => {
                    game().state = 'playing'
                    setState(game().state)
                }} textContent='Play' />
            </Match>

        </Switch >

    </section>
}

export default TicTacToe