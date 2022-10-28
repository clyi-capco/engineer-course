docker run -d \
    -p 27017:27017 \
    -v data-vol:/data/db \
    mongo:latest