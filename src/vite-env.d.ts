
interface ImportMetaEnv {
    readonly VITE_TEXT_ALIVE_TOKEN: string;
    readonly VITE_BASE_URL: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}