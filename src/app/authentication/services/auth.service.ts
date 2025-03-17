import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";

import { LoginModel } from '../models/loginModel';
import { isPlatformBrowser } from '@angular/common';
import { RegisterModel } from '../models';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/auth`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) { }

  public async AuthenticateUser(login: LoginModel) : Promise<any> {
    return this.http.post(`${this.baseUrl}/login`, login, { withCredentials: true });
  }

  public createAuthenticationAsync(registerModel: RegisterModel) : Observable<any>  {
    return this.http.post(`${this.baseUrl}/register`, registerModel);
  }

  public updateCuthenticationAndConsultant(registerModel: RegisterModel) : Observable<any>  {
    return this.http.post(`${this.baseUrl}/update`, registerModel);
  }

   /**
   * Obtain the jwt token of the user logged
   * @returns Get the Token stored in local storage
   */
   public getAuthorizationToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }

    return null;
  }

   /**
   * Get roles from token
   */
   public getUserRoles(): string[] {
    const token = this.getAuthorizationToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode<JwtPayload>(token);

      return decoded?.role ? (Array.isArray(decoded.role) ? decoded.role : [decoded.role]) : [];
    } catch (ex) {
      console.error(`getUserRoles method Error: ${ex}`);
      return [];
    }
  }

  /**
   * Check if user has a specific role
   */
    public hasRole(role: string): boolean {
      return this.getUserRoles().includes(role);
    }

      /**
  * Verify if user is authenticated
  * @returns boolean
  */
  public isUserLoggedIn(): boolean {
    const token = this.getAuthorizationToken();

    if (!token || this.isTokenExpired(token)) return false;

    return true;
  }

  /**
   * Verify if the user is a consultant
   * @returns true or false
   */
  public isConsultant() : boolean {
    const roles = this.getUserRoles();
    return roles.includes('Consultant');
  }

    /**
   * Verify if the user is a consultant
   * @returns true or false
   */
    public isManager() : boolean {
      const roles = this.getUserRoles();
      return roles.includes('Manager');
    }

    /**
   * Verify if the user is a owner
   * @returns true or false
   */
  public isOwner(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('Owner');
  }

    /**
   * Verify if the user is a support role
   * @returns true or false
   */
  public isSupport() : boolean {
    const roles = this.getUserRoles();
    return roles.includes('Support');
  }

    /**
   * Verify if the user is a sysadmin
   * @returns true or false
   */
  public isSysAdmin() : boolean {
    const roles = this.getUserRoles();
    return roles.includes('SysAdmin');
  }

   /**
   * Verify is token is valid and not expirated
   * @param token
   * @returns Date
   */
   private getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded: any = jwtDecode<JwtPayload>(token);

      if (!decoded.exp) return null;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date;
    } catch (ex) {
      console.error(`getTokenExpirationDate method Error: ${ex}`);
      return null;
    }
  }

  /**
   * Verify if token is valid
   * @param token
   * @returns boolean
   */
  private isTokenExpired(token?: string): boolean {
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (!date) return true;

    return !(date.valueOf() > new Date().valueOf());
  }
}
