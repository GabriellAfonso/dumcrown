# Generated by Django 4.2.17 on 2025-01-29 13:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dumcrown', '0004_alter_player_board'),
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.IntegerField()),
                ('created_at', models.DateTimeField()),
                ('history', models.TextField()),
                ('loser', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Match_loser', to='dumcrown.player')),
                ('winner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Match_winner', to='dumcrown.player')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
    ]
