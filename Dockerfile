# the necessary instructions
# to create a Docker container image
# for the summary client using the
# NGINX web server image as the base

FROM nginx
ADD default.conf /etc/nginx/conf.d/default.conf
COPY package.json package-lock.json /usr/share/nginx/html/
COPY ./dist /usr/share/nginx/html
EXPOSE 443