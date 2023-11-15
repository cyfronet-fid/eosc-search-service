FROM python:3.10

# Pyspark requires java
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
         openjdk-17-jre-headless \
  && apt-get autoremove -yqq --purge \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
# Don't write pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1
COPY . .
RUN pip install --upgrade pip pipenv
RUN pipenv install --deploy --system