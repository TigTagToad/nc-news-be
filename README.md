# TUNS o FUN
Taiga's Underwater News Service for Friendly Underwater Newts

Hosted on [Render.](https://nc-news-g82w.onrender.com/api)

## Background

This project is an API than retreives information/news articles from a database, intended to be used by newts and other acquatic life.

## Setup
1. Clone the repo. 
2. Install postgresql using package manager
3. Add two files: `.env.test` and `.env.development`. Into each, add `PGDATABASE=nc_news_test` (for .test) and `PGDATABASE=nc_news` (for .development).
4. Run `npm install` to install the dependancies 
5. Run `npm run setup-dbs` to set up the databases
6. Run `npm run seed` to seed the database
7. Run `npm run start` to run the application

## Endpoints

Full list of API endpoints available at /api

## Dependencies 

Tested on node v22.9.0 

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
