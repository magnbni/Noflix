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
   For windows:

   ```bash
   python -m venv venv
   ./venv/Scripts/activate
   ```

   and for Linux and mac:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
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
- Browsing of the given results
- Filtering the search result based on genres and year of release. Note that the filtration is done on the entire dataset, not just what has been loaded to the client.
- Sorting the search result based on title, release date, and rating
- Pagination of the search result to ensure that the client is not overloaded with data
- Clicking on a movie to get more information about it, such as an overview of the movie and a possibility to rate it
- Redux, local state

## About our techstack

Noflix is a Vite based React app that uses a mongoDB server connecting to a fully python backend. The driver used is called mongoengine, while the endpoints are exposed through Flask. To combine Flask with GraphQL we use the graphene library.

We also use the component library MaterialUI, consisting of many prebuilt yet customizable components. These are used in conjunction with our own custom components to provide a responsive design. Redux and local storage is also used to ensure that a user is logged in while navigating the page and that the user can filter and ssort search results.

We chose these technologies mostly because of the familiarity to the team developers, but also because of the ease of implementation.

## Code quality

### Pipelines

For our project we decided to use GitLab pipelines. Specifically, a branch needs to comply with both linting and 'prettier' to be merged. This is to prevent errors from being merged into the main branch, and also ensuring readable and high code quality. It also means all distributions have the same formatting, which may have created unneccessary git changes. Still, some bugs find their way, through no fault of the pipelines.

### Approval of merge requests

Before anything is merged to main, another group members must approve the merge request. This is to ensure that the code is of high quality, and that it follows the guidelines set by the group. This is also to ensure that the code is well documented, and that the commit messages are descriptive. Its also a way of ensuring that the project runs as intended on all devices.

### Standardized commit messages

During our process we got feedback on our commit messages. This was due to the lack of mentioning which commit message belonged to what issue. This was something we already implemented in our branch naming convention, yet due to this feedback we decided to somewhat standardize the commit messages by adding "Fixes #issue_nr" in all commit messages. Hopefully this improved the comprehension of our commit messages to the outside observer.

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

### Responsive design

We have made sure that our application is responsive, and can be used on all devices. We have done this by using the component library MaterialUI, which has many prebuilt components that are responsive. We have also made sure that our own components are responsive, and that they can be used on all devices.

This is also an important step towards making our application accessible to everyone, as it makes it easier for people with disabilities to use our application. For instance, people with visual impairments can use our application on their phones.

### Accessibility

It's important to us that our application is accessible to everyone. We have therefore implemented a few features to make it easier for people with disabilities to use our application. We have carefully selected colours which make it easy for everyone to see all buttons and components. We have also made sure that the application is easy to navigate using only the keyboard. We have also made sure that all images, buttons and similar have alt-text or aria labels.

In the future we hope to implement more accessibility features, such as a dark mode, more keyboard shortcuts and screen reader friendly in all browsers.

For any further inquires about the application, please contact us <button onclick="window.location.href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygULcmljayBhc3RsZXk%3D'">here</button>
