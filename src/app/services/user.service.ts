import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Observable} from 'rxjs';

import { GLOBAL } from './global';
import { User } from "../models/user";


@Injectable()
export class UserService {
    public url: string;

    constructor(private httpClient: HttpClient) {
        this.url = GLOBAL.url;
    }

    signUp(user_to_login: any, getHash: boolean) {
        user_to_login.getHash = getHash || false;
        let json = JSON.stringify(user_to_login);
        let params = json;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.httpClient.post(this.url+'login', params, {headers: headers}).toPromise();
    }

    register(user_to_register: any) {
        let json = JSON.stringify(user_to_register);
        let params = json;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.httpClient.post(this.url+'register', params, {headers: headers}).toPromise();
    }

    updateUser(user_to_update:any, identity: any, token: any) {
        let json = JSON.stringify(user_to_update);
        let params = json;
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this.httpClient.patch(`${this.url}updateUser/${identity._id}`, params, {headers: headers}).toPromise();
    }

    signIn() {
        return "Hola mundo desde el servicio";
    }
}