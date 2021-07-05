import { User } from './models/user.model';

let usersList: User[] = [
    {
        id: '1',
        login: 'Abc',
        password: '123',
        age: 1,
        isDeleted: false
    },
    {
        id: '2',
        login: 'Bc',
        password: '456',
        age: 2,
        isDeleted: false
    },
    {
        id: '3',
        login: 'Cb',
        password: '789',
        age: 3,
        isDeleted: false
    }
];

export function getUserList(): User[] {
    return usersList;
}

export function getUserById(id: string): User | undefined {
    return usersList.find((user: User) => user.id === id);
}

export function deleteUserById(id: string): User | undefined {
    const user = getUserById(id);

    if (user) {
        user.isDeleted = true;
    }

    return user;
}

export function addUser(newUser: User): User {
    usersList.push(newUser);

    return newUser;
}

export function updateUserById(id: string, data: User): User | undefined {
    let updatedUser = getUserById(id);

    usersList = usersList.map((user) => {
        if (user.id === id) {
            updatedUser = { ...user, ...data };

            return updatedUser;
        }

        return user;
    }) as User[];

    return updatedUser;
}

export function getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
    return usersList
        .filter((item) => item.login.toLowerCase().includes(loginSubstring.toLowerCase()))
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(0, limit);
}
