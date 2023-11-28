# Welcome to Noflix

<img width="300" height="300" src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"></img>

## Start the application

To begin using our application, you must:

1. Navigate to the folder 'prosjekt2/backend' and run the following commands:

   ```bash
   pip install -r requirements.txt
   python app.py
   ```

   If you are struggeling, you might have to create a virtual environment. This can be done by running the following commands:

   ```bash
   python -m venv venv
   ./venv/Scripts/activate
   ```

   and then run the commands above.

2. Navigate to the folder 'prosjekt2/prosjekt2' and in a new terminal run the following commands:

   ```bash
   npm install
   npm run dev
   ```

## What is Noflix?

Noflix is your new favourite webpage for browsing movies. We have a database consisting of over **20 000** movies.
This means that you are sure to find a movie that you are interested in, and can watch it on your streaming service of choice. Like other popular movie-databases, its main features include:

- Searching for specific titles
- Sorting based on genres
- Browsing of the given results
- Personal as well as a public rating of the movies

More features may be added as the application evolves.

## About our techstack

Noflix is a Vite based React app that uses a mongoDB server connecting to a fully python backend. The driver used is called mongoengine, while the endpoints are exposed through Flask. To combine Flask with GraphQL we use the graphene library.

We also use the component library MaterialUI, consisting of many prebuilt yet customizable components. These are used in conjunction with our own custom components to provide a responsive design.

We chose these technologies mostly because of the familiarity to the team developers, but also because of the ease of implementation.

## Testing

Testing is deficient as of version 3, but some end-to-end tests can be executed by running the command:

```bash
npm run cypress:open
```

We also use vitest, whose tests can be ran via the command:

```bash
npm run test
```

in the prosjekt2 folder.

## Roadmap

We want to create the best app for your movie finding pleasure. To do this, we have developed a simple roadmap for the different versions of our application:

### Version 1: A simple layout and framework

The first version of our application consists of the following:

- A first look at the application
- A responsive design
- The ability to search through mock data

### Version 2: Connecting to the backend

Our second iteration of the application will contain a proper backend connected to our MongoDB database. It will include:

- A proper python backend based on Flask, using GraphQL queries with graphene
- Fetching, sorting and filtering of the data found in our MongoDB database
- A more fully realised frontend design
- Storing and calculation of ratings based on user input
- User implementation

### Version 3: Finishing the product

The third and final version aims to complete the product. In addition to a fully functioning application, we will also implement:

- Unit, mock and other tests based on the vitest testing library
- Deployment to a server

For any further inquires about the application, please contact us <button onclick="window.location.href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygULcmljayBhc3RsZXk%3D'">here</button>
