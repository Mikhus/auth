/*!
 * ISC License
 * 
 * Copyright (c) 2018, Imqueue Sandbox
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */
import {
    IMQService,
    expose,
    profile,
    IMQClient,
} from '@imqueue/rpc';
import { createHandyClient, IHandyRedis } from 'handy-redis';
import { jwtEncode, jwtDecode } from '.';
import { clientOptions, AUTH_DB_HOST, AUTH_DB_PORT } from '../config';
import { md5 } from './encryption';

export class Auth extends IMQService {

    /**
     * User service client
     * @type {IMQService}
     */
    private user: any;

    /**
     * Tokens database connection
     */
    private db: IHandyRedis;

    /**
     * Performs all required async preparations
     * on service initialization
     */
    public async start() {
        this.user = new (
            await IMQClient.create('User', clientOptions)
        ).UserClient();
        await this.user.start();
        this.db = createHandyClient({
            host: AUTH_DB_HOST,
            port: AUTH_DB_PORT
        });
        return super.start();
    }

    /**
     * Logs user in
     *
     * @param {string} email - user email address
     * @param {string} password - user password hash
     * @return {string|null} - issued user auth token or null if auth failed
     */
    @profile()
    @expose()
    public async login(email: string, password: string): Promise<string | null> {
        const user = await this.user.fetch(email,
            ['_id', 'email', 'password', 'isAdmin', 'isActive']);

        if (!(user && user.password === md5(password) && user.isActive)) {
            return null;
        }

        delete user.password;

        return jwtEncode(user);
    }

    /**
     * Logs user out
     *
     * @param {string} token
     * @return {boolean}
     */
    @profile()
    @expose()
    public async logout(token: string): Promise<boolean> {
        const data = jwtDecode(token) as any;

        if (!data) {
            return true;
        }

        const ttl: number = new Date().getTime() - data.exp * 1000;
        await this.db.set(token, "0", ['PX', ttl], 'NX');

        return true;
    }

    /**>
     * Verify if user token is valid, and if so - returns an associated user
     * object
     *
     * @param {string} token
     * @return {object | null}
     */
    @profile()
    @expose()
    public async verify(token: string): Promise<object | null> {
        if (await this.db.exists(token)) {
            return null;
        }

        const data = jwtDecode(token) as any;

        if (!data || data.exp && new Date().getTime() > data.exp * 1000) {
            return null;
        }

        return this.user.fetch(data.email);
    }

}
