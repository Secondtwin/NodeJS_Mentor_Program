import { sign, verify } from 'jsonwebtoken';

export class AuthenticationService {
    static getToken(payload: { name: string | undefined, id: string | undefined }): string {
        return sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    }

    static checkToken(token: string): boolean {
        try {
            const decoded = verify(token, process.env.JWT_SECRET || 'secret');

            return !!decoded;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
