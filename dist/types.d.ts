export interface Script {
    commands: string[];
    sync?: boolean;
}
export interface importOptions {
    buildEnd?: Script;
    buildStart?: Script;
    closeWatcher?: Script;
    watchChange?: Script;
    moduleParsed?: Script;
    generateBundle?: Script;
    renderError?: Script;
    renderStart?: Script;
    writeBundle?: Script;
    transformIndexHtml?: Script;
    configureServer?: Script;
    handleHotUpdate?: Script;
}
export interface exportOptions {
    name: string;
    buildEnd?: () => void;
    buildStart?: () => void;
    closeWatcher?: () => void;
    watchChange?: () => void;
    transformIndexHtml?: () => void;
    configureServer?: () => void;
    handleHotUpdate?: () => void;
    moduleParsed?: () => void;
    renderError?: () => void;
    renderStart?: () => void;
    writeBundle?: () => void;
    generateBundle?: () => void;
    closeBundle?: () => void;
}
