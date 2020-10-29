const puppeteer = require('puppeteer');
const axios = require('axios');

const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

class mPage {
    static async build() {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        const cPage = new mPage(page);

        return new Proxy(cPage, {
            get: function (target, property) {
                return cPage[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'express:sess', value: session });
        await this.page.setCookie({ name: 'express:sess.sig', value: sig });
        await this.page.goto('http://localhost:3000/admin-panel');
        await this.page.waitForSelector('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async getHrefOf(selector) {
        return this.page.$eval(selector, el => el.href);
    }

    async post(path, data) {
        return axios.post(path, data)
            .then(function (response) {
                return response.request.path;
            })
            .catch(function (error) {
                return error;
            });
    }

    execRequests(actions) {
        return Promise.all(actions.map(({ method, path, data }) => {
            return this[method](path, data);
        })
        );
    }
}

module.exports = mPage;