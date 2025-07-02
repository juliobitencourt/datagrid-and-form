# Datagrid and form

A simple [VILT Stack](https://viltstack.dev/) project with a Datagrid and Stepper form.

## Getting Started

First, clone the repository

```
git@github.com:juliobitencourt/datagrid-and-form.git
```

Copy the .env.example file to the .env file

```
cp .env.example .env
```

Install the dependencies
```
composer install
npm install
```

Create the application key
```
php artisan key:generate
```

## Database instructions

Create a PostgreSQL database and add the credentials in the **.env** file
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=datagrid_and_form
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Run the migrations
```
php artisan migrate --seed
```

Running the application \o/
```
npm run dev
npm run build
php artisan serve
```

## Sample User Credentials
test@example.com
password

## Running tests
```
./vendor/bin/pest
npm run test
```