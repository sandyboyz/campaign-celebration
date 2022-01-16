## Description

Campaign Celebration API Example

## Requirements

- Docker
- Docker-Compose
## How to run this application
Just run one single-command

```bash
$ ./run.sh
```
or
```bash
$ sh run.sh
```



## What's in the Project
- Docker with 3 Image (Node.js, Postgres, Redis)
- Already included Schema Database (using Prisma)
- Already included seed/initial data

## Trivia
- Why Use Redis? Is Postgres itself enough for this case?
  
  Redis use to use be able track submission photo within 10 minutes case. Redis here use not for cache solution but to became fast-queue system. The queue will able to delayed message to 10 minutes and evaluate the logic
  
## The API Documentation

After the program run <br>
Please open <b style="color:green">localhost:3000/api</b> on browser <br>
this will open Open API/Swagger Documentation


