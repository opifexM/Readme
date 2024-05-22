# Readme

Readme is a straightforward headless blog engine built using microservice architecture and the modern Nest.js framework. The project comprises multiple microservices, each addressing a specific task.

## Description

Readme focuses on backend development for a multi-user blog. The core feature of the service is the variety of publication formats and the ability to subscribe to updates from other users, which influences the user's content feed.

## Features

-   **User Management**: Registration, JWT-based authentication, and user profile management.
-   **Content Management**: Creation, editing, deletion, and viewing of various types of blog posts (video, text, quote, photo, link).
-   **File Management**: Uploading images for blog posts.
-   **Notification Management**: Email notifications about new publications.
-   **API Gateway**: Integration of multiple microservices for a seamless API experience.

## Usage

The project is developed using a microservice architecture with the following technologies:

-   **Nest.js**: The primary framework used for building the microservices.
-   **TypeScript**: Ensures type safety and modern JavaScript features.
-   **MongoDB and PostgreSQL**: Used for database management, as per the requirements of each microservice.
-   **JWT**: For secure authentication.
-   **Docker**: To containerize and manage microservices.

Each microservice can be served and managed using specific commands:

### User Management
-   **Serve Application**:
    ```bash
    npx nx run user-management:serve
    ```

-   **Docker Up**:
    ```bash
    docker compose --file ./apps/user-management/docker-compose.dev.yml --env-file ./apps/user-management/user-app.env --project-name "readme-user-management" up -d
    ```

-   **Docker Down**:
    ```bash
    docker compose --file ./apps/user-management/docker-compose.dev.yml --env-file ./apps/user-management/user-app.env --project-name "readme-user-management" down
    ```

### Content Management
-   **Serve Application**:
    ```bash
    npx nx run content-management:serve
    ```

-   **Docker Up**:
    ```bash
    docker compose --file ./apps/content-management/docker-compose.dev.yml --env-file ./apps/content-management/content-app.env --project-name "readme-content-management" up -d
    ```

-   **Docker Down**:
    ```bash
    docker compose --file ./apps/content-management/docker-compose.dev.yml --env-file ./apps/content-management/content-app.env --project-name "readme-content-management" down
    ```

### File Management
-   **Serve Application**:
    ```bash
    npx nx run file-management:serve
    ```

-   **Docker Up**:
    ```bash
    docker compose --file ./apps/file-management/docker-compose.dev.yml --env-file ./apps/file-management/file-app.env --project-name "readme-file-management" up -d
    ```

-   **Docker Down**:
    ```bash
    docker compose --file ./apps/file-management/docker-compose.dev.yml --env-file ./apps/file-management/file-app.env --project-name "readme-file-management" down
    ```


### Notification Management
-   **Serve Application**:
    ```bash
    npx nx run notification-management:serve
    ```

-   **Docker Up**:
    ```bash
    docker compose --file ./apps/notification-management/docker-compose.dev.yml --env-file ./apps/notification-management/notification-app.env --project-name "readme-notification-management" up -d
    ```

-   **Docker Down**:
    ```bash
    docker compose --file ./apps/notification-management/docker-compose.dev.yml --env-file ./apps/notification-management/notification-app.env --project-name "readme-notification-management" down
    ```

### API Service
-   **Serve API**:
    ```bash
    npx nx run api:serve
    ```

### General Commands
-   **Reset**:
    ```bash 
    npx nx reset
    ```

## Database Management

### Prisma Commands (Content Management)

-   **Lint Database Schema**:
    ```bash 
    npx prisma validate --schema ./schema.prisma
    ```

-   **Migrate Database**:
    ```bash 
    npx prisma migrate dev --schema ./schema.prisma --skip-generate --skip-seed
    ```

-   **Reset Database**:
    ```bash 
    npx prisma migrate reset --schema ./schema.prisma --force --skip-generate --skip-seed
    ```

-   **Generate Prisma Client**:
    ```bash 
    npx prisma generate --schema ./schema.prisma
    ```

-   **Seed Database**:
    ```bash 
    npx ts-node seed.ts
    ```

## Technologies Used

-   **Nest.js**: A modern framework for building efficient, reliable, and scalable server-side applications.
-   **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
-   **MongoDB and PostgreSQL**: Flexible and powerful databases for different microservices.
-   **JWT**: JSON Web Tokens for secure authentication.
-   **Docker**: Containerization for efficient deployment and management of microservices.
-   **Prisma**: ORM for database management.
-   **Commander.js**: Handles command-line inputs.
-   **Lodash**: Offers a comprehensive set of utility functions to streamline code.
-   **js-yaml**: Parses YAML files.
-   **Jest**: Facilitates testing of the application.
-   **ESLint**: Ensures adherence to code quality standards.
-   **RabbitMQ**: For message queueing.
-   **Multer**: Handles file uploads.
-   **Nodemailer**: Manages email functionalities.

## License

Readme is licensed under the ISC license.
