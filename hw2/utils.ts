import { User } from './models/user.model';

let usersList: User[] = [
    {
        id: '1',
        login: 'A',
        password: '123',
        age: 1,
        isDeleted: false
    },
    {
        id: '2',
        login: 'B',
        password: '456',
        age: 2,
        isDeleted: false
    },
    {
        id: '3',
        login: 'C',
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
    const updatedUserList: User[] = usersList.map((user) => {
        if (user.id === id) {
            updatedUser = { ...user, ...data };

            return updatedUser;
        }

        return user;
    }) as User[];

    usersList = updatedUserList;

    return updatedUser;
}

// export function getAutoSuggestUsers(loginSubstring: string, limit: number) {
//   /* TODO: implement logic */
// }
