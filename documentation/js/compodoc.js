/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

var compodoc = {
    EVENTS: {
        READY: 'compodoc.ready',
        SEARCH_READY: 'compodoc.search.ready'
    }
};

Object.assign( compodoc, EventDispatcher.prototype );

document.addEventListener('DOMContentLoaded', function() {
    compodoc.dispatchEvent({
        type: compodoc.EVENTS.READY
    });
});
