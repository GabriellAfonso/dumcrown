FROM python:3.10.6-alpine
LABEL maintainer="gabrieldelimaafonso@gmail.com"

# Essa variável de ambiente é usada para controlar se o Python deve 
# gravar arquivos de bytecode (.pyc) no disco. 1 = Não, 0 = Sim
ENV PYTHONDONTWRITEBYTECODE 1

# Define que a saída do Python será exibida imediatamente no console ou em 
# outros dispositivos de saída, sem ser armazenada em buffer.
# Em resumo, você verá os outputs do Python em tempo real.
ENV PYTHONUNBUFFERED 1

# Copia a pasta "djangoapp" e "scripts" para dentro do container.
COPY dumcrown /dumcrown
COPY scripts /scripts

# Entra na pasta djangoapp no container
WORKDIR /dumcrown

# Adiciona permissões de execução ao arquivo "commands.sh"
RUN chmod +x /scripts/commands.sh

# A porta 8000 estará disponível para conexões externas ao container
# É a porta que vamos usar para o Django.
EXPOSE 8000

# RUN executa comandos em um shell dentro do container para construir a imagem. 
# O resultado da execução do comando é armazenado no sistema de arquivos da 
# imagem como uma nova camada.
# Agrupar os comandos em um único RUN pode reduzir a quantidade de camadas da 
# imagem e torná-la mais eficiente.
RUN python -m venv /venv && \
  /venv/bin/pip install --upgrade pip && \
  /venv/bin/pip install -r /dumcrown/requirements.txt && \
  adduser --disabled-password --no-create-home duser

# Adiciona a pasta scripts e venv/bin 
# no $PATH do container.
ENV PATH="/scripts:/venv/bin:${PATH}"

# Executa o arquivo commands.sh
CMD ["commands.sh"]
