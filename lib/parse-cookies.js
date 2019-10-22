module.exports =  function parseCookies(request) {
    const cookies = {};

    (request.headers && request.headers.cookie || '').split(';').forEach((cookie) => {
        if (cookie) {
            const [_, key, value] = cookie.match(/(.*?)=(.*)$/);

            cookies[ key.trim() ] = (value || '').trim();
        }
    });

    return cookies;
};
