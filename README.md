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

## Accessibility

It's important to us that our application is accessible to everyone. We have therefore implemented a few features to make it easier for people with disabilities to use our application. We have carefully selected colours which make it easy for everyone to see all buttons and components. We have also made sure that the application is responsive, so that it can be used on all devices. We have also made sure that the application is easy to navigate using only the keyboard. We have also made sure that the application is screen reader friendly, and that all images, buttons and similar have alt-text or aria labels.

## Testing

Testing is deficient as of version 3, but some end-to-end tests can be executed by running the command:

```bash
npm run cypress:open
```

in the prosjekt2 folder.

If the user then chooses to do the tests using Chrome, it is important to change the URL from https to http before opening "specs.cy.ts". If this is not done it will cause the site to reload infinitely becuase of an update to Chrome that sets the URL to https by default.

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

## Our Design Choices

### Sustainable design

Because of the current focus on energy usage in current developmentental environment, we have made some conscious decisions to help with sustainability. Some of these choices include:

- Few requests to our database: Since GraphQL provides useful functionality for only fetching the minimal amount of data needed, we have focused on creating specific queries that only fetch the needed data. Our pagination is also quite limited, with only 12 results per page, meaning the only time we fetch more than that at a time is on the homepage or on the user ratings page.
- As for the User homepage, we consider it a valuable tradeoff. Considering the presentation of a selection of movies may make a user browse the homepage instead of searching, it can reduce the number of requests made as a whole.
- Caching: Apollo client can store queries in the cache, meaning we do not have to refetch any already made queries. This makes for example the homepage an even more viable solution for reducing requests.

Still, we could have made some improvements regarding the design. We don't currently have a dark mode, and while our use of a simple colorscheme does help reduce energy usage, we have not implemented a dark mode. This would reduce energy usage even further, as darker colors produce less light, and therefore consume less energy.

For any further inquires about the application, please contact us <button onclick="window.location.href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygULcmljayBhc3RsZXk%3D'">here</button>
