FROM python:3.11.3-alpine3.18
LABEL maintainer="gabrieldelimaafonso@gmail.com"

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

COPY dumcrown /dumcrown
COPY scripts /scripts

WORKDIR /dumcrown

RUN chmod +x /scripts/commands.sh && \
    chmod -R a+rw /dumcrown

EXPOSE 8001


RUN python -m venv /venv && \
  /venv/bin/pip install --upgrade pip && \
  /venv/bin/pip install -r /dumcrown/requirements.txt && \
  adduser --disabled-password --no-create-home duser

ENV PATH="/scripts:/venv/bin:${PATH}"

CMD ["commands.sh"]
