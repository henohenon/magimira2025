import { Player as TextAlivePlayer, type IPlayerApp } from "textalive-app-api";

const taPlayer = new TextAlivePlayer({ app: { token: import.meta.env.VITE_TEXT_ALIVE_TOKEN } });
taPlayer.addListener({
  onVideoReady: (app: IPlayerApp) => {
    console.log("App is ready", app);
  },
});