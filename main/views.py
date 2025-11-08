from django.shortcuts import render, redirect
from .models import Post
from .forms import PostForm

def feed(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('feed')  # redireciona pra limpar o form
    else:
        form = PostForm()

    posts = Post.objects.all().order_by('-criado_em')
    return render(request, 'feed.html', {'form': form, 'posts': posts})
