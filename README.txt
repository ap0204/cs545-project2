Project 2 for CS 453/553.
Author: Alejandro Palacio
Credit to Dr. Dan Schrimpsher for his github example, which I used as the base for this project.
Link: https://github.com/dschrimpsher/cs453-rest-example 

This project is implemented using Docker containers coordinated with Docker Compose.

The first container is our node server and the second is the MongoDB backend which will be storing all of the car records.
The records are stored as one large entry.

NOTE: Initially I was running into errors when using $docker-compose up. It would say that a module could not be found (axios)
This was resolved by using $npm install axios. After which, I had no issues building and running the docker containers.
I'm not sure why this resolved the issue, since the docker containers are supposed to have their own copies of the npm modules,
but that is what worked for me.
______________________________________________________________________________________________________

Starting:
    In this directory, call 
        $ docker-compose pull
        $ docker-compose build
    These commands will pull the needed images and construct the images for the next step
        $ docker-compose up
    This command will start the services and will output to the terminal when they are running.
    The database will be started with one dummy entry.

Using:
    The server can be confirmed to be running by navigating to http://localhost:3000/cars in the browser
    The server may also be interacted with by using curl commands. As listed below and in the example_curl_calls.txt file.
    [id] is the MongoDB unique identifier, the "_id" field. Replace the "[id]" with the desired ID.

    The first example is how to interact with the SOAP server. The REST endpoint is /order/:part
    As with [id], replace [part] with the number of your choice. (it is hardcoded so the actual number doesn't matter)

    GET (a part):
        curl -X GET --location "http://localhost:3000/order/[part]"



    GET (all):
        curl -X GET --location "http://localhost:3000/cars"

    GET (one)
        curl -X GET --location "http://localhost:3000/cars/[id]"

    DELETE:
        curl -X DELETE --location "http://localhost:3000/cars/[id]"

    POST:
        curl -X POST --location "http://localhost:3000/cars" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d "{
        \"vin\": \"555552345BHEJSKLR\",
        \"plate_number\": \"BFFF00\",
        \"state\": \"IN\",
        \"make\": \"Dodge\",
        \"model\": \"Challenger\",
        \"year\": \"2005\",
        \"owner_name\": \"Rick Martinez\",
        \"owner_address\": \"555 not-real lane\",
        \"owner_dl_number\": \"111122223333\",
        \"problem_description\": \"customer says alignment needs to be checked.\",
        \"day_in\": \"2019-01-10\",
        \"day_out\": \"2019-01-15\",
        \"workers\": [\"Ashley\", \"Markus\"],
        \"shop_location\": \"Gary, IN\"
        }"

    PUT:
        curl -X PUT --location "http://localhost:3000/cars/[id]" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d "{
        \"vin\": \"000012345BHEJSKLR\",
        \"plate_number\": \"BL0173\",
        \"state\": \"MA\",
        \"make\": \"HONDA\",
        \"model\": \"Civic\",
        \"year\": \"2016\",
        \"owner_name\": \"James Docker\",
        \"owner_address\": \"99 false avenue\",
        \"owner_dl_number\": \"123456789\",
        \"problem_description\": \"Flat tire.\",
        \"day_in\": \"2015-01-01\",
        \"day_out\": \"2015-01-03\",
        \"workers\": [\"Kenneth\"],
        \"shop_location\": \"Dayton, OH\"
        }"


Closing:
    In the terminal that the docker containers are running, press Ctrl+c.

