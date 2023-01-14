# syntax=docker/dockerfile:1
FROM python:3.9

WORKDIR /week1

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP = week1.py

EXPOSE 3000

CMD ["python", "week1.py"]
