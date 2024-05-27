import path from 'node:path';
import fs from 'node:fs/promises';

import abslog from 'abslog';

const ACTION = /action(\.js|\.ts)/;
const ROUTE = /route(\.js|\.ts)/;
const PAGE = /page(\.js|\.ts)/;

export default class Hierarchy {
    constructor({ cwd = process.cwd(), app = './pages', logger } = {}) {
        this.logger = abslog(logger);
        this.cwd = cwd;                                 // Current Working Directory
        this.rad = app;                                 // Relative Application Directory
        this.aad = path.resolve(this.cwd, this.rad);    // Absolute Application Directory
    }

    async * #walk(directory) {
        for await (const d of await fs.opendir(directory)) {
            const entry = path.join(d.parentPath, d.name);

            if (d.isDirectory()) {
                yield* await this.#walk(entry);

            } else if (d.isFile()) {
                let route = d.parentPath.replace(this.aad, '');
                if (route === '') route = '/';          // Make sure root route is a /

                if (ACTION.test(entry)) {
                    yield {
                        bundle: false,
                        route,
                        file: entry,
                        type: 'action', 
                    };
                }
                if (ROUTE.test(entry)) {
                    yield {
                        bundle: false,
                        route,
                        file: entry,
                        type: 'route', 
                    };
                }
                if (PAGE.test(entry)) {
                    yield {
                        bundle: true,
                        route,
                        file: entry,
                        type: 'page', 
                    };
                }
            }
        }
    }

    load() {
        return this.#walk(this.aad);
    }

    async entryPoints() {
        const entries = [];
        for await (const entry of this.#walk(this.aad)) {
            if (entry.bundle) {
                entries.push(entry.file);
                /* TODO: Create hashes for out files
                entries.push({
                    out: entry.file,
                    in: entry.file,
                });
                */
            }
        }
        return entries;
    }
}