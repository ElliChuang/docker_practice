# syntax=docker/dockerfile:1
FROM python:3.9

COPY . /week1

WORKDIR /week1

COPY . .

RUN pip3 install -r requirements.txt

ENV FLASK_APP = week1.py

EXPOSE 3000

CMD ["python", "week1.py"]
