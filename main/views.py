from django.shortcuts import render, redirect
from .models import Post
from .forms import PostForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login

@login_required
def feed(request):
    posts = Post.objects.all().order_by('-criado_em')
    form = PostForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        post = form.save(commit=False)
        post.autor = request.user
        post.save()
        return redirect('feed')
    return render(request, 'feed.html', {'posts': posts, 'form': form})


def registro(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            usuario = form.save()
            login(request, usuario)
            return redirect('feed')
    else:
        form = UserCreationForm()
    return render(request, 'registro.html', {'form': form})

@login_required
def novo_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.autor = request.user
            post.save()
            return redirect('feed')
    else:
        form = PostForm()
    return render(request, 'post.html', {'form': form})