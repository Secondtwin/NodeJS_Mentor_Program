import * as request from 'supertest';
import { app } from '../app';

export let userService;

describe('Users Route', () => {
    afterAll((done) => {
        done();
    });

    test('GET /users should return users list', async () => {
        const response = await request(app)
            .get('/users');

        expect(response.statusCode).toEqual(200);
    });
});
