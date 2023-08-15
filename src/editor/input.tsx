import type { Component, Signal } from "solid-js";
import { Match, Switch, createSignal } from "solid-js";

export type InputType = 'boolean' | 'text' | 'number' | 'range' | 'color';
export type Value<T extends InputType> =
    T extends 'boolean' ? boolean :
    T extends 'text' ? string :
    T extends 'color' ? `#${string}` :
    T extends 'number' | 'range' ? number : never;

export type Relay<T extends unknown> = (value: T) => void;
export type DefaultProps<T, V> = {
    type: T;
    name: string;
    relay?: Relay<V>;
    signal?: Signal<V>;
    initialValue?: V;
    class?: string;
};
export type Props<T extends InputType, V = Value<T>> = T extends 'range' | 'number' ? DefaultProps<T, V> & {
    min: number;
    max: number
} : DefaultProps<T, V>;

export type TextProps = Props<'text'>;
export type ColorProps = TextProps;
export type BooleanProps = Props<'boolean'>;
export type RangeProps = Props<'range'>
export type NumberProps = Props<'number'>

function inputSignal<T extends unknown>(initialValue: T, potentialSignal?: Signal<T>) {
    if (!potentialSignal)
        return createSignal(initialValue)
    return potentialSignal
}

export const Boolean: Component<BooleanProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? false, props.signal)
    return <input type="checkbox" checked={signal[0]()} id={props.name} class={props.class} name={props.name} onchange={(e) => {
        e.preventDefault();
        signal[1](!signal[0]())
        if (props.relay) {
            props.relay(signal[0]())
        }
    }} />
}

export const Number: Component<NumberProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? 0, props.signal)

    return <input type='number' value={signal[0]()} min={props.min} max={props.max} id={props.name} class={props.class} name={props.name} oninput={(e) => {
        e.preventDefault();
        e.currentTarget.value.charAt(0) !== '' ?
            signal[1](parseInt(e.currentTarget.value)) :
            signal[1](0)

        props.relay && props.relay(signal[0]())

    }} />
}

export const Text: Component<TextProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? '', props.signal)

    return <input type="text" value={props.initialValue} id={props.name} class={props.class} name={props.name} oninput={(e) => {
        e.preventDefault();
        signal[1](e.currentTarget.value)
        props.relay && props.relay(signal[0]())
    }} />
}

export const Color: Component<TextProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? '#fff', props.signal)

    return <input type="color" value={signal[0]()} id={props.name} class={props.class} name={props.name} oninput={(e) => {
        e.preventDefault();
        signal[1](e.currentTarget.value)
        props.relay && props.relay(signal[0]())
    }} />
}

export const Range: Component<RangeProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? 0, props.signal)

    return <>
        <input type='range' value={signal[0]()} min={Math.floor(props.min)} max={Math.floor(props.max)} id={props.name} class={props.class} name={props.name} onchange={(e) => {
            e.preventDefault();
            signal[1](parseInt(e.currentTarget.value))
            props.relay && props.relay(parseInt(e.currentTarget.value))
        }}
        />
    </>
}
const Input: Component<Props<InputType>> = (props) => {
    return <Switch>
        <Match when={props.type === 'number'}>
            <Number {...props as NumberProps} />
        </Match>
        <Match when={props.type === 'boolean'}>
            <Boolean {...props as BooleanProps} />
        </Match>
        <Match when={props.type === 'text'}>
            <Text {...props as TextProps} />
        </Match>
        <Match when={props.type === 'color'}>
            <Color {...props as TextProps} />
        </Match>
        <Match when={props.type === 'range'}>
            <Range {...props as RangeProps} />
        </Match>
    </Switch>
}

export default Input;