FROM node:22-alpine
ARG APP_DIR=/fuzzer-frontend
ENV FUZZER_FRONTEND_PORT=8080
WORKDIR ${APP_DIR}
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE ${FUZZER_FRONTEND_PORT}
CMD ["npm", "start"]