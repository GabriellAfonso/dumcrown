
class SpellCard:

    def __init__(self, id, card):
        self.id = id
        self.image = card['image']
        self.name = card['name']
        self.description = card['description']
        self.energy = card['energy']

    def get_data(self):
        return {
            'id': self.id,
            'image': self.image,
            'name': self.name,
            'description': self.description,
            'energy': self.energy,
        }
