# What is this?

It contains API's for create, get operations for tiny urls

# Why docker?

Docker enables developers to easily pack, ship, and run any application as a lightweight, portable, self-sufficient container, which can run virtually anywhere.

# How to use it?
1. [Install docker](https://docs.docker.com/install/) 
2. docker-compose up
3. Done!

# Docker build and push 
docker login
docker build -t deepak6446/tinyurl:latest .
docker push deepak6446/tinyurl:latest .

# kubernets deployment is available at [Medium](https://medium.com/@deepak.r.poojari/deployment-with-kubernetes-k8-on-gcp-1aa8ea5a81bf) 
# API's

1.  create a tiny url

    ### /url/create

    - Create a Tiny Url

    ```javascript
    {
        "url":"https://docs.google.com/document/HYAuHGq5yQBxj3IVUehW-XfHgwEbR8W5nw/edit?usp=sharing"
    }
    ```

2)  Get long url from shorturl.

    ### /tiny_url

    - Returns long url created by user

3)  Get count of short url created in specified time range.

    ### /urlCount/:fromDate/:toDate

    - Returns count of number of urls created in date range
