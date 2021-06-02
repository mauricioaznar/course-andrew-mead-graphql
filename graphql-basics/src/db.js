const users = [
    {
        id: '1',
        name: 'Andrew',
        email: 'email@gmail.com',
        age: 1
    },
    {
        id: '2',
        name: 'Mau',
        email: 'mau@gmail.com',
    },
    {
        id: '3',
        name: 'Fer',
        email: 'fer@gmail.com',
    }
]

const posts = [
    {
        id: '11',
        title: 'Andrew',
        body: 'email@gmail.com',
        published: true,
        author: '1'
    },
    {
        id: '12',
        title: 'Maguas',
        body: 'mau@gmail.com',
        published: true,
        author: '2'
    },
    {
        id: '13',
        title: 'Fer',
        body: 'fer',
        published: true,
        author: '3'
    },
    {
        id: '14',
        title: 'Fer',
        body: 'fer',
        published: true,
        author: '3'
    }
]

const comments = [
    {
        id: '21',
        text: 'comment 1',
        author: '1',
        post: '12'
    },
    {
        id: '22',
        text: 'comment 2',
        author: '2',
        post: '11'
    },
    {
        id: '23',
        text: 'comment 3',
        author: '3',
        post: '11'
    },
    {
        id: '24',
        text: 'comment 4',
        post: '13',
        author: '2',
    },
    {
        id: '25',
        text: 'comment 4',
        post: '14',
        author: '2',
    }
]

const db = {
    users,
    posts,
    comments
}

export { db as default }