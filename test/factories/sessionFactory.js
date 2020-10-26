const buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.session_secret]);

module.exports = (id) => {
    const sessionObject = {
        passport: {
            user: id
        }
    };

    const session = buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const sig = keygrip.sign('express:sess=' + session);

    return { session, sig };
};