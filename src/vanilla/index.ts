
export default class VanillaGame {
    state: "playing" | "play" | "play again" = 'play';
    #turn = 0;
    boxes = new Array(9)
    #possibleWinStates = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [6, 4, 2]

    ] as const

    #players = {
        player_1: {
            symbol: 'X',
        },
        player_2: {
            symbol: 'O',
        }
    }

    get turnSymbol() {
        return this.#turn % 2 === 0 ? this.#players.player_1.symbol : this.#players.player_2.symbol
    }

    get turn() {
        return this.#turn;
    }

    place(placementIndex: number) {
        const sym = this.turnSymbol;
        this.boxes[placementIndex] = sym;
        console.log(placementIndex, sym, this.boxes);
    }

    handleTurn(placementIndex: number) {
        this.place(placementIndex);
        if (this.check()) {
            this.state = 'play again'
        }
        this.#turn++;
    }

    check(): boolean {
        for (let i = 0; i < this.#possibleWinStates.length; i++) {
            const spots = this.#possibleWinStates[i];
            if (this.checkSpot(spots)) {
                return true
            }
        }
        return false
    }

    checkSpot(spot: readonly number[]) {
        const p1 = this.#players.player_1.symbol
        const p2 = this.#players.player_2.symbol

        return (
            (this.boxes[spot[0]] === p1 && this.boxes[spot[1]] === p1 && this.boxes[spot[2]] === p1) ||
            (this.boxes[spot[0]] === p2 && this.boxes[spot[1]] === p2 && this.boxes[spot[2]] === p2)
        )
    }


}

