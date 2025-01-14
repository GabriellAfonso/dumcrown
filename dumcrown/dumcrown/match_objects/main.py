winner = 0
loser = 50

winner_gain = max(1, round(loser*0.28)+10)
loser_loss = max(1, round(loser*0.28))


winner += winner_gain
loser -= loser_loss
print(f'winner: {winner_gain}')
print(f'loser: {loser_loss}')
print('-'*20)
print(f'winner: {winner}')
print(f'loser: {loser}')
