/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

 /**  
   * The authGuard function is an Angular route guard that checks if a user is logged in by  
   * inspecting the local storage for a specific key (LoggedInUser ). If the user is found to be  
   * logged in, they are redirected to the /home route, and the guard returns false, preventing  
   * access to the requested route. If the user is not logged in, the guard returns true, allowing  
   * access to the route.
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
 
 