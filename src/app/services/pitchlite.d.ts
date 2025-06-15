/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

declare module 'src/app/services/pitchlite' {
    /**
     * The pitchlite module, which is used for pitch detection.
     * This module is expected to be initialized before use.
     * 
     * @returns {Promise<any>} A promise that resolves to the pitchlite module.
     * @example
     * const pitchlite = await pitchlite();
     */
    const pitchlite: any;

    export = pitchlite;
}

