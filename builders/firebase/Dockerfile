FROM node:lts-alpine3.20 AS app-env

# Install only what's needed for Firebase deployment (Functions + Hosting)
RUN apk add --no-cache bash && \
    npm install -g firebase-tools && \
    rm -rf /var/cache/apk/* /root/.npm

ADD firebase.bash /usr/bin
RUN chmod +x /usr/bin/firebase.bash

ENTRYPOINT [ "/usr/bin/firebase.bash" ]

