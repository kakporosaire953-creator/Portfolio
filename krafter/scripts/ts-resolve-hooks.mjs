import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Appends `.ts` to a relative import the bundler would resolve for us. */
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (specifier.startsWith(".") && context.parentURL) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) return next(candidate.href, context);
    }
    throw error;
  }
}
