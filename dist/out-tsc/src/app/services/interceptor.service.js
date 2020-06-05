import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
let InterceptorService = class InterceptorService {
    constructor(auth) {
        this.auth = auth;
    }
    intercept(req, next) {
        return this.auth.getTokenSilently$().pipe(mergeMap(token => {
            const tokenReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
            return next.handle(tokenReq);
        }), catchError(err => throwError(err)));
    }
};
InterceptorService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], InterceptorService);
export { InterceptorService };
//# sourceMappingURL=interceptor.service.js.map