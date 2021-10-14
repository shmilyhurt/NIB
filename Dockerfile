FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/6382061_shmilyhurt.top.key /etc/nginx
COPY nginx/6382061_shmilyhurt.top.pem /etc/nginx


