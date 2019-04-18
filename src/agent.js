import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';


const superagent = superagentPromise(_superagent, global.Promise);


export const API_ROOT = 'http://35.241.210.208';
/* Remove this comment if KOREK-backend is booted locally */
//export const API_ROOT = 'http://localhost';

window.localStorage.setItem('API_ROOT', API_ROOT);


const responseBody = res => res;

let token = null;
let csrf = null;
const Plugins = req => {
    if (token) {
        req.set('Authorization', `Bearer ${token}`);
    }
    if (csrf) {
        req.set('X-CSRFToken', `${csrf}`);
    }
}

const requests = {
    del: url =>
        superagent.del(`${API_ROOT}${url}`).set('Content-Type', 'application/json').use(Plugins).then(responseBody),
    get: url =>
        superagent.get(`${API_ROOT}${url}`).set('Content-Type', 'application/json').use(Plugins).then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).set('Content-Type', 'application/json').use(Plugins).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).set('Content-Type', 'application/json').use(Plugins).then(responseBody),
    post_data: (url, body) =>
        superagent.post(`${API_ROOT}${url}`).send(body).set('Accept', 'application/json').use(Plugins).then(responseBody),
    put_data: (url, body) =>
        superagent.put(`${API_ROOT}${url}`).send(body).set('Accept', 'application/json').use(Plugins).then(responseBody)

};

const Auth = {
    get_csrf: () =>
        requests.get('/api-auth/login/'),
    login: (username, password) =>
        requests.post('/api-token-auth/', { username, password }),
    register: user =>
        requests.post_data('/register/', user),
    save: (id, user) =>
        requests.put_data(`/register/${id}/`, user),
    delete: id =>
        requests.del(`/register/${id}/`),
    current: () =>
        requests.get('/')
};


const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const Articles = {
    all: page =>
        requests.get(`/products?${limit(10, page)}`),
    feed: (page, owner) =>
        requests.get(`/products?${limit(10, page)}&owner__username=${ owner ? owner : window.localStorage.getItem('username')}`),
    get: slug =>
        requests.get(`/products/${slug}/`),
    highlight: slug =>
        requests.get(`/products/${slug}/highlight/`),
    create: product =>
        requests.post_data('/products/', product),
    del: slug =>
        requests.del(`/products/${slug}/`),
    update: article =>
        requests.put_data(`/products/${article.id}/`, article),
    delete_media: article =>
        requests.put_data(`/products/${article.id}/`, article),
};


const Profile = {
    register: () =>
        requests.get(`/register/`),
    profiles: (page) =>
        requests.get(`/profiles?${limit(10, page)}`),
    byAuthor: (username) =>
        requests.get(`/profiles/?profile__user__username=${username}`),
    getGroup: () =>
        requests.get(`/groups/`),
    addGroup: (group_name, id) =>
        requests.put(`/groups/${id}/`, { groups: [{ name: group_name }] }),
    getAcknowlegment: () =>
        requests.get(`/acknowlegment/`),
    validateFriend: (id, val) =>
        requests.put(`/acknowlegment/${id}/`, { activate: val }),
};

export default {
    Articles,
    Auth,
    Profile,
    setToken: _token => { token = _token; },
    setCsrf: _csrf => { csrf = _csrf; }
};