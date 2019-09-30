# Meetup-Rocketseat

## Meetup ##


Projeto destinado ao curso Bootcamp Rocketseat.

Tecnologias/Conceitos Utilizados:

Javascript <br />
NodeJS <br />
ReactJS <br />
React Native <br />
Postgres <br />
MongoDB <br />
Docker <br />
Redis <br />
Filas de e-mail <br />

Configure Postgres:
$ docker run --name gobarberdatabase -e POSTGRES_PASSWORD=docker -p 5434:5432 -d postgres <br />

Configure Mongo:
$ docker run --name mongobarber -p 27018:27017 -d -t mongo <br />

Configure Redis: 
$ docker run --name redisbarber -p 6380:6379 -d -t redis:alpine <br />


Run Project:
yarn dev <br />

Run Redis:
yarn queue <br />
