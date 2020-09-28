# ![React + Redux + Korek Api]

(project-logo.png)

This frontend is based on https://github.com/gothinkster/react-redux-realworld-example-app

> ### This frontend is a user content management system example for web applications

## Getting started

You can view a live demo over at (https://korek-react.ml)

> user: toto password: toto
> user: toto1 password: toto

## Run Korek frontend locally

- Install & Boot Korek backend see https://github.com/MathieuB1/KOREK-backend
- Clone this repository
- `cd frontend`
- `npm install` to install all requested dependencies
- `npm start` to start the local http server (this project uses create-react-app)

Local web server will use port 4100 and 80 for nginx proxy. You can configure port in scripts section of `package.json`.
 
## Run docker-compose

- `cd KOREK-frontend/ && docker-compose down && docker-compose build && docker-compose up`

## Generate SSL Certificate

Replace "korek-react.com" with your own domain.

> Dummy SSL:
```
docker exec -it $(docker ps | grep nginx_react_1 | awk '{print $NF}') /bin/bash -c "cd / && ./generate_ssl.sh"
```
> Fake Lets encrypt (Because of rate limit on Let's encrypt server:
```
docker exec -it $(docker ps | grep nginx_react_1 | awk '{print $NF}') /bin/bash -c "./generate_ssl.sh -t -l -d korek-react.com"
```
> Lets encrypt:
```
docker exec -it $(docker ps | grep nginx_react_1 | awk '{print $NF}') /bin/bash -c "./generate_ssl.sh -l -d korek-react.com"
```

Then go to https://korek-react.com

### Making requests to the backend API

The Django source code for the backend server can be found in the [KOREK github repository](https://github.com/MathieuB1/KOREK).

For convenience, we have a live API server running at https://korek-react.ml/ for the application to make requests against.

If you want to change the API URL to a local server, simply edit `src/agent.js` and change `API_ROOT` to the local server's URL (i.e. `http://localhost/`)


## Functionality overview

The example application is targeting the KOREK backend API, which provides a Django backend for managing users & media posts

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on header)
- CRUD users (sign up & settings page & deleting user)
- CRUD Articles (Images & Videos & Audio creation support)
- GET and display paginated lists of articles & friends
- Follow other users
- Articles Tags/Category
- Articles Locations
