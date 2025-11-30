from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Post(models.Model):
    autor = models.CharField(max_length=100)
    conteudo = models.TextField(max_length=280)  # limite tipo Twitter
    data_criacao = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.autor}: {self.conteudo[:30]}...'
    
class Post(models.Model):
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    conteudo = models.CharField(max_length=280)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.autor.username}: {self.conteudo[:50]}'


