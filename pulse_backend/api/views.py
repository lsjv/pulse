from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Post, Like, Comment, Notification
from .serializers import (
    UserSerializer, UserRegistrationSerializer,
    PostSerializer, LikeSerializer, CommentSerializer,
    NotificationSerializer
)

User = get_user_model()

# ✅ REMOVA completamente a função feed solta daqui (linhas 18-40)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        if user_to_follow == request.user:
            return Response({'error': 'Você não pode seguir a si mesmo'}, status=status.HTTP_400_BAD_REQUEST)
        request.user.following.add(user_to_follow)
        Notification.objects.create(recipient=user_to_follow, sender=request.user, notification_type='follow')
        return Response({'status': 'seguindo'})

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        user_to_unfollow = self.get_object()
        request.user.following.remove(user_to_unfollow)
        return Response({'status': 'deixou de seguir'})

    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        user = self.get_object()
        followers = user.followers.all()
        serializer = UserSerializer(followers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        user = self.get_object()
        following = user.following.all()
        serializer = UserSerializer(following, many=True)
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(author__id=user_id)
        return queryset

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if created:
            if post.author != request.user:
                Notification.objects.create(recipient=post.author, sender=request.user, notification_type='like', post=post)
            return Response({'status': 'curtido'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status': 'já curtido'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        post = self.get_object()
        try:
            like = Like.objects.get(user=request.user, post=post)
            like.delete()
            return Response({'status': 'descurtido'})
        except Like.DoesNotExist:
            return Response({'error': 'Você não curtiu este post'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post)
            if post.author != request.user:
                Notification.objects.create(recipient=post.author, sender=request.user, notification_type='comment', post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Feed corrigido - agora funciona para usuários não autenticados também"""
        try:
            if request.user.is_authenticated:
                # Usuário logado - mostra posts dele e de quem segue
                if hasattr(request.user, 'following'):
                    following_ids = request.user.following.values_list('id', flat=True)
                    posts = Post.objects.filter(
                        Q(author__in=following_ids) | Q(author=request.user)
                    ).order_by('-created_at')
                else:
                    # Se não tem following, mostra todos os posts
                    posts = Post.objects.all().order_by('-created_at')
            else:
                # Usuário não logado - mostra todos os posts
                posts = Post.objects.all().order_by('-created_at')[:20]
            
            # Paginação
            page = self.paginate_queryset(posts)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(posts, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': f'Erro no feed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'todas marcadas como lidas'})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marcada como lida'})