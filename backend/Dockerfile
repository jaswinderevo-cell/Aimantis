# Use an official Python image
FROM python:3.12-slim

WORKDIR /backend

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy requirements and install dependencies
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip3 install cryptography
RUN pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
RUN pip install django-extensions
RUN pip install pyyaml ua-parser user-agents
RUN flake8 .
RUN black --check .
# Copy project files python manage.py makemigrations
COPY . .

# Start cron and Django server
CMD sh -c "service cron start && \
           # Run remaining migrations \
           python manage.py migrate && \
           python manage.py crontab add && \
           python manage.py runserver 0.0.0.0:8000"
