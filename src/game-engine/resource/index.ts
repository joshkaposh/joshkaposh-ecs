import type { Type, Class } from "..";

export type Res<T = {}> = T extends Type & {
    Instance: () => infer I;
} ? I : never

export type ResType<T = Type<string, 'Res'>> = T & {};
export type AnyRes = Res<{
    readonly type: string
    Instance: () => Class;
}>