
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
        self.state = 'onDeck'

    def set_defense(self, value):
        self.defense = value

    def add_defense(self, value):
        self.defense += value

    def remove_defense(self, value):
        self.defense -= value

    def is_dead(self):
        if self.defense <= 0:
            return True

        return False

    def get_data(self):
        return {
            'id': self.id,
            'type': self.type,
            'image': self.image,
            'name': self.name,
            'description': self.description,
            'energy': self.energy,
            'attack': self.attack,
            'defense': self.defense,
            'state': self.state,
        }
