import type { Component, ParentComponent } from 'solid-js'
import input, { InputType, Props } from './input';
export const Input = input;

function className(default_name: string, name?: string) {
    return name ? `${name}-${default_name}` : default_name
}

export const Section: Component<{
    inputProps: Props<InputType>
    class?: string;
}> = (props) => {
    return <div class={className('form-section')}>
        <label>{props.inputProps.name}</label>
        <Input {...props.inputProps} />
    </div>
}

const Form: ParentComponent<{
    on_submit: () => void;
    class?: string;
}> = (props) => {
    let ref: HTMLFormElement;
    return <form ref={ref!} class='file-form' onSubmit={(e) => {
        e.preventDefault();
        props.on_submit();
    }}>
        {props.children}
        <input type="submit" />
    </form>
}

export default Form;