const nameGenerator = require('../name-generator');
const parseCookies = require('../parse-cookies');

module.exports = function username(req, res) {
    const cookies = parseCookies(req);
    let user = cookies.user;

    if (!user) {
        user = nameGenerator();

        res.setHeader('Set-Cookie', `user=${user}`)
    }
}
