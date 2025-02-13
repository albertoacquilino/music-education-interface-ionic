/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);
    const userInfo = localStorage.getItem('LoggedInUser');
    if (userInfo) {
        router.navigate(['/home']);
        return false;
    }
    return true;
    
};

