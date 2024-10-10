
class UnitCard:

    def __init__(self, id, card):
        self.id = id
        self.type = card['type']
        self.image = card['image']
        self.name = card['name']
        self.description = card['description']
        self.energy = card['energy']
        self.attack = card['attack']
        self.defense = card['defense']

    def get_data(self):
        return {
            'id': self.id,
            'image': self.image,
            'name': self.name,
            'description': self.description,
            'energy': self.energy,
            'attack': self.attack,
            'defense': self.defense,
        }
