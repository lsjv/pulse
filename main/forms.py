from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['conteudo']  # 👈 tiramos o campo 'autor'
        widgets = {
            'conteudo': forms.Textarea(attrs={'rows': 3, 'placeholder': 'O que está acontecendo?'}),
        }
