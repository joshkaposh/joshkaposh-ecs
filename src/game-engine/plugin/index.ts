import App from ".."

export type PluginType<T = new () => Plugin> = T

export type Plugin<T = {
    build: (app: App) => App
}> = T