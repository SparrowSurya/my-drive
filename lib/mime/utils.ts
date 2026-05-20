import { resolveBrowserRenderable, resolvePlainText } from "./resolvers";

export const isImage = (mimeType: string) => mimeType.startsWith("image/");
export const isAudio = (mimeType: string) => mimeType.startsWith("audio/");
export const isVideo = (mimeType: string) => mimeType.startsWith("video/");
export const isPdf = (mimeType: string) => mimeType === "application/pdf";
export const isText = (mimeType: string) => resolvePlainText(mimeType);
export const isSpreadsheet = (mimeType: string) => /spreadsheet|excel|\.sheet/.test(mimeType);
export const isDocument = (mimeType: string) => /word|document|msword|odt|pages|epub/.test(mimeType);
export const isPresentation = (mimeType: string) => /presentation|powerpoint|\.presentation/.test(mimeType);
export const isArchive = (mimeType: string) => /zip|gzip|tar|bzip|rar|7z|xz/.test(mimeType);
export const isFont = (mimeType: string) => mimeType.startsWith("font/");
export const isBrowserRenderable = (mimeType: string) => resolveBrowserRenderable(mimeType);
export const isCode = (mimeType: string) => isText(mimeType) && CODE_MIME_PATTERN.test(mimeType);
export const isConfig = (mimeType: string) => isText(mimeType) && CONFIG_MIME_PATTERN.test(mimeType);


const CODE_MIME_PATTERN = /javascript|typescript|x-python|x-ruby|x-c|x-java-source|x-go|x-rust|x-sh|sql|php|html|css|shell|bash|source|script|swift|kotlin|dart|scala|haskell|lua|perl|julia|clojure|elixir|erlang|fsharp|powershell|dockerfile|makefile/i;
const CONFIG_MIME_PATTERN = /json|yaml|yml|toml|xml|config|properties|ini|editorconfig|gitignore/i;
