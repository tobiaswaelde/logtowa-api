FROM node:lts-alpine
RUN apk add yarn curl

WORKDIR /app

# install production dependencies only
COPY package.json /app/package.json
RUN ["yarn", "install"]

# build app
COPY . /app
ENV NODE_ENV production
RUN ["yarn", "build"]

ENV PORT 3001
EXPOSE 3001

# enable health check
HEALTHCHECK CMD curl --fail http://localhost:3001/api/health || exit 1

# start app
CMD ["yarn", "start:prod"]