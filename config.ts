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
import { IMQServiceOptions, IMQClientOptions } from '@imqueue/rpc';
import { config as initEnvironment } from 'dotenv';

initEnvironment();

/* check environments variables if required to bypass secrets */

export const serviceOptions: Partial<IMQServiceOptions> = {
    /* define your service-specific options here */
};

export const clientOptions: Partial<IMQClientOptions> = {
    safeDelivery: true,
    write: false
};

export const JWT_KEY: string = process.env['JWT_KEY'] || 'ewf874398iad';
export const JWT_EXPIRE: number = parseInt(
    process.env['JWT_EXPIRE'] || '3600', 10
);

export const AUTH_DB_HOST = process.env['AUTH_DB_HOST'] || 'localhost';
export const AUTH_DB_PORT = parseInt(process.env['AUTH_DB_PORT'] || '6379', 10);
