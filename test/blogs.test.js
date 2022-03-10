const Page = require('./helpers/page.js');
const {assert, expect} = require('chai');
const chalk = require('chalk');

let page;

const actions = [
    {
        method: 'post',
        path: 'http://localhost:3000/blogs',
        data: {title: 'My title', subtitle: 'My subtitle', body: 'My body'}
    }]
;

before(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

after(async () => {
    await page.close();
});

describe(chalk.magenta('Blog routes ~> when user is not logged in'), async () => {
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

    it('Can not post /blogs,', async () => {
        const path = await page.execRequests(actions);

        assert.equal(path, '/auth/login');
    });
});

describe(chalk.cyan('Blog routes ~> when user is logged in'), () => {
    beforeEach(async () => {
        await page.login();
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
});
