import { register } from "node:module";

/**
 * Lets plain Node import the project's TypeScript modules.
 *
 * Node 22 strips types natively but still requires an explicit extension, while
 * the app imports `./noise` the way a bundler expects. This hook only fills that
 * gap, so the sculpture tests can run against the same source the site ships.
 */
register("./ts-resolve-hooks.mjs", import.meta.url);
