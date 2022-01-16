FROM node:14.17.5

WORKDIR /usr/src/celebration_campaign

RUN apt-get update && apt-get install -y netcat

# ENV path /usr/src/ddd/node_modules/.bin:$PATH

COPY . /usr/src/celebration_campaign

RUN npm i -g dotenv-cli

RUN npm i

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]