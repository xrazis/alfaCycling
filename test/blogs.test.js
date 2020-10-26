const Page = require('./helpers/page.js');
const { assert, expect } = require('chai');
const chalk = require('chalk');

let page;

before(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

after(async () => {
    await page.close();
});

describe(chalk.magenta('When user is not logged in'), async () => {
    it('Can see login,', async () => {
        await page.goto('http://localhost:3000/auth/login');

        const login = await page.getContentsOf('h1');

        assert.equal(login, 'Login');
    });

    it('Can see register,', async () => {
        await page.goto('http://localhost:3000/auth/register');

        const register = await page.getContentsOf('h1');

        assert.equal(register, 'Register');
    });

    it('Can not see admin panel,', async () => {
        await page.goto('http://localhost:3000/admin-panel');

        const login = await page.getContentsOf('h1.is-size-1');

        assert.equal(login, 'Login');
    });

    it('Can not see new page,', async () => {
        await page.goto('http://localhost:3000/blogs/new');

        const login = await page.getContentsOf('h1');

        assert.equal(login, 'Login');
    });

    it('Can not see edit page,', async () => {
        await page.goto('http://localhost:3000/blogs');
        const href = await page.getHrefOf('a.action');

        await page.goto(href + '/edit');
        const login = await page.getContentsOf('h1');

        assert.equal(login, 'Login');
    });
});

describe(chalk.cyan('When user is logged in'), () => {
    beforeEach(async () => {
        await page.login();
    });

    it('Can see logout,', async () => {
        const logout = await page.getContentsOf('a[href="/auth/logout"]');

        assert.equal(logout, 'Logout');
    });

    it('Can see admin panel,', async () => {
        const adminPanel = await page.getContentsOf('h1.is-size-1');

        assert.equal(adminPanel, 'Admin Panel');
    });

    it('Can see new page,', async () => {
        await page.goto('http://localhost:3000/blogs/new');

        const create = await page.getContentsOf('h1.is-size-1');

        assert.equal(create, 'New blog');
    });

    it('Can see edit page,', async () => {
        await page.goto('http://localhost:3000/admin-panel');
        await page.click('button.is-warning');

        const edit = await page.getContentsOf('h1.is-size-1');

        assert.equal(edit, 'Edit blog');
    });

    it('Can logout', async () => {
        await page.click('a[href="/auth/logout"]');

        const login = await page.getContentsOf('a[href="/auth/login"]');

        assert.equal(login, 'Login');
    });
});
