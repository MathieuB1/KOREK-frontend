import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

import {
    UPLOAD_PROGRESS
} from './constants/actionTypes';
import { store } from './store';

const superagent = superagentPromise(_superagent, global.Promise);

export const API_ROOT = 'https://korekk.ml';
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
    get_image_media: url =>
        superagent.get(`${url}`).use(Plugins).responseType('blob').then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).set('Content-Type', 'application/json').use(Plugins).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).set('Content-Type', 'application/json').use(Plugins).then(responseBody),
    post_data: (url, body) =>
        superagent.post(`${API_ROOT}${url}`).send(body).set('Accept', 'application/json').use(Plugins).on('progress', event => {
            const percent = event.percent;
            const action = { type: UPLOAD_PROGRESS, percent }
            store.dispatch(action);
        }).then(responseBody),
    put_data: (url, body) =>
        superagent.put(`${API_ROOT}${url}`).send(body).set('Accept', 'application/json').use(Plugins).on('progress', event => {
            const percent = event.percent;
            const action = { type: UPLOAD_PROGRESS, percent }
            store.dispatch(action);
        }).then(responseBody)

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
        requests.get(`/products?${limit(8, page)}`),
    filter: (filters, page) =>
        requests.get(`/products?${limit(8, page)}${filters}`),
    feed: (page, owner) =>
        requests.get(`/products?${limit(8, page)}&owner__username=${owner ? owner : window.localStorage.getItem('username')}`),
    get_image_media: name =>
        requests.get_image_media(`${name}`),
    get_tags: () =>
        requests.get(`/tags/`),
    tag: (page, tag_slug) =>
        requests.get(`/products?${limit(8, page)}&tags__name=${ tag_slug ? tag_slug : 'other' }`),
    category: (page, category_slug) =>
        requests.get(`/products?${limit(8, page)}&category__name=${ category_slug }`),
    tag_owner: (page, tag_slug, owner) =>
        requests.get(`/products?${limit(8, page)}&tags__name=${ tag_slug ? tag_slug : 'other' }&owner__username=${owner}`),
    category_owner: (page, category_slug, owner) =>
        requests.get(`/products?${limit(8, page)}&category__name=${ category_slug }&owner__username=${owner}`),
    get_categories: () =>
        requests.get(`/categories/`),
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
    delete: (id) =>
        requests.del(`/profiles/${id}/`),
    getGroup: () =>
        requests.get(`/groups/`),
    addGroup: (group_name, id) =>
        requests.put(`/groups/${id}/`, { groups: [{ name: group_name }] }),
    getAcknowlegment: () =>
        requests.get(`/acknowlegment/`),
    validateFriend: (id, val) =>
        requests.put(`/acknowlegment/${id}/`, { activate: val }),
};


const Comments = {
    create: (comment) =>
        requests.post(`/comment/`, comment),
    delete: (slug) =>
        requests.del(`/comment/${slug}/`),
};


export default {
    Articles,
    Auth,
    Profile,
    Comments,
    setToken: _token => { token = _token; },
    setCsrf: _csrf => { csrf = _csrf; }

};
