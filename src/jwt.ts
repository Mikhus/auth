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
import * as jwt from 'jsonwebtoken';
import { JWT_KEY, JWT_EXPIRE } from '../config';

/**
 * Encodes given json payload and returns jwt token
 *
 * @param {string | object | Buffer} payload
 * @return {string}
 */
export function jwtEncode(payload: string | object | Buffer) {
    return jwt.sign(payload, JWT_KEY, { expiresIn: JWT_EXPIRE });
}

/**
 * Verifies if a given jwt token is valid and returns decoded object
 *
 * @param {string} token
 * @return {string | object | null}
 */
export function jwtDecode(token: string): string | object | null {
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (err) {
        return null;
    }
}
