FROM node:10

WORKDIR /app

COPY . /app/

RUN yarn install --pure-lockfile 

RUN yarn global add prisma

#RUN prisma deploy 

#RUN yarn run get-schema

#CMD ["yarn", "run", "start"]