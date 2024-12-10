
class SpellCard:

    def __init__(self, id, card):
        self.id = id
        self.type = card['type']
        self.image = card['image']
        self.name = card['name']
        self.description = card['description']
        self.energy = card['energy']
        self.state = 'onDeck'

    def get_data(self):
        return {
            'id': self.id,
            'type': self.type,
            'image': self.image,
            'name': self.name,
            'description': self.description,
            'energy': self.energy,
            'state': self.state,
        }
