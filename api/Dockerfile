FROM osgeo/gdal:ubuntu-full-latest

ENV APP_ROOT /src
ENV CONFIG_ROOT /config

# Install dependencies
RUN apt-get update
RUN apt-get install -y python3-dev python3-pip 
RUN apt-get install -y libpq-dev libjpeg62 libjpeg62-dev
RUN apt-get install -y mysql-server libmysqlclient-dev


RUN mkdir ${CONFIG_ROOT}
COPY requirements.txt ${CONFIG_ROOT}/requirements.txt
RUN pip3 install -r ${CONFIG_ROOT}/requirements.txt

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}

ADD / ${APP_ROOT}
ENTRYPOINT ["./gunicorn_starter.sh"]