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

