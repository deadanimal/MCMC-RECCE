# Django Backend Template

You can use this template to start your backend development

## Getting Started

This is a simple template to create your backend using Django 2

### Prerequisites

Make sure to have python3, gdal, postgresql installed
1. To install gdal on mac
    ```
    brew install gdal
    ```
2. To install postgresql
    ```
    brew install postgresql
    ```

### Installing

1. Clone this repo to your local disk
2. Rename your project
3. Create virtual environment by using the command
    ```
    virtualenv env —-python=python3 -—distribute
    ```
4. Activate virtualenv by using the command
    ```
    source env/bin/activate
    ```
5. Installing the required package in requirements.txt by using the command
    ```
    pip install -r requirements.txt
    ```
6. Running the commands
    ```
    python manage.py makemigrations
    python manage.py migrate
    ```
7. Serve the project by using the command
    ```
    python manage.py runserver
    ```
8. Done

## Create a new app

You can create a new app by using the command
```
django-admin startapp app_name
```

After creating the new app;

1. Create a new file in the folder named as
    ```
    serializers.py
    ```
2. Edit models.py
3. Edit views.py
4. Add app to settings.py
5. Add url to urls.py

### Making changes

After creating any changes to models.py, you have to run these commands to apply the changes

```
python manage.py makemigrations
python manage.py migrate
```

Serve the project view changes locally


### Installing a package

To install a package

1. Install the package using pip
    ```
    pip install package_name
    ```
2. Freeze the package to requirements.txt
    ```
    pip freeze > requirements.txt
    ```
3. Done

## Deployment

For development purpose, we will use Heroku to deploy this project to a server. You will need to setup .env file in the project and use it in Heroku.

## Related links

* [Django](https://docs.djangoproject.com/en/2.2/) - Django
* [Heroku](https://www.heroku.com/) - For deployment
* [Bitbucket](https://bitbucket.org/) - Code repository



