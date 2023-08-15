import { For, type Component, ParentComponent } from 'solid-js'
import '../assets/editor.css'
import App, { EditorLoad, EngineTypeName } from '../game-engine';
import { create_file } from '../io';
import Form, { Section, Input } from './form';
type FileInformation = {
    name: string;
    path: string;
}

const Dropdown: ParentComponent<{
    title: string;
    inner?: true;
}> = (props) => {
    return <div class={`${props.inner ? 'inner-' : ""}dropdown`}>
        <button class={`${props.inner ? 'inner-' : ""}dropbtn`}>{props.title}</button>
        <div class={`${props.inner ? 'inner-' : ""}dropdown-content`}>
            {props.children}
        </div>
    </div>
}

const Toolbar: Component<{
    app: App;
}> = (props) => {
    console.log('Toolbar::', props.app.systems);

    let fileForm: HTMLFormElement;
    let selectType: HTMLSelectElement;

    return <ul class='toolbar'>
        <li class='toolbar-file'>
            <Dropdown title='File' >
                <Dropdown inner title='New File'>
                    <Form class='file-form' on_submit={() => { }}>
                        <Section inputProps={{
                            name: 'path',
                            type: 'text',
                        }} />
                        <Section inputProps={{
                            name: 'type',
                            type: 'text',
                            initialValue: false
                        }} />
                    </Form>
                    <form ref={fileForm!} class='file-form' onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(fileForm)
                        const path = data.get('path')
                        if (!path || path === '') {
                            return
                        }
                        create_file(path as string, data.get('type') as EngineTypeName)
                    }}>
                        <div class='form-section'>
                            <label for='path'>Path: </label>
                            <input type="text" name="path" id="path" value='' />
                        </div>
                        <div class="form-section">
                            <label for='type'>Type: </label>
                            <select ref={selectType!} name="type" id="type" value='system'>
                                <option value="System">System</option>
                                <option value="Res">Resource</option>
                                <option value="Entity">Entity</option>
                            </select>
                            <input type="submit" />
                        </div>
                    </form>
                </Dropdown>
            </Dropdown>
        </li>
    </ul>
}

const Editor: Component<{
    app: App;
}> = (props) => {

    return <div>
        <Toolbar
            app={props.app}
        />
    </div>
}

export default Editor