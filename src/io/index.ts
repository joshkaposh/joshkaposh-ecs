import { io } from "socket.io-client";
import CONSTS from '../../consts.json'
import { EngineTypeName } from "../game-engine";

type VSCodeURL = `vscode://file/${string}`

const socket = io('http://localhost:5174/', {
    withCredentials: true
})

function openVSCode(path: string) {
    const url = `vscode://file/${path}` satisfies VSCodeURL;
    window.location.href = url;
}
export function create_file(path: string, type: EngineTypeName) {
    const name = path.split('/').pop()!
    path = `${CONSTS.root}/src/${path}`;
    socket.emit('new_file', path, name, type)
    socket.on('new_file_ready', openVSCode)
}

export default socket;