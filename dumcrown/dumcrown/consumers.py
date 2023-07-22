# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PlayerConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = 'player'

        # join to group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self):
        #leave group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # recive message from websocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        event = {
            'type': 'send_message',
            'message': message
        }        
        
        #send message to group
        await self.channel_layer.group.send(self.group_name, event)

    # receive message from group
    async def send_message(self, event):
        message = event['message']

        # send message to websocket
        await self.send(text_data=json.dumps({'message': message}))