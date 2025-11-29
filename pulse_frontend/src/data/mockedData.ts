export const mockedPosts = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    },
    content: 'Acabei de lançar meu novo projeto! Muito animada para compartilhar isso com vocês. 🚀',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 24,
    likedBy: ['user2', 'user3'],
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user2',
          name: 'João Pedro',
          email: 'joao@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
        },
        content: 'Parabéns! Mal posso esperar para ver!',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      }
    ]
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'João Pedro',
      email: 'joao@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
    },
    content: 'Qual o melhor framework JavaScript em 2024? React, Vue ou Angular? Me ajudem nessa decisão! 🤔',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 15,
    likedBy: ['user1'],
    comments: [
      {
        id: 'c2',
        author: {
          id: 'user3',
          name: 'Ana Costa',
          email: 'ana@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana'
        },
        content: 'React sem dúvida! A comunidade é incrível.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      }
    ]
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Ana Costa',
      email: 'ana@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana'
    },
    content: 'Bom dia! Começando a semana com energia e café ☕️ Quais são seus objetivos para esta semana?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 42,
    likedBy: ['user1', 'user2', 'user4'],
    comments: []
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Carlos Oliveira',
      email: 'carlos@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos'
    },
    content: 'Acabei de terminar um curso de TypeScript. Quem mais está aprendendo? Dicas para compartilhar? 📚',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likes: 31,
    likedBy: ['user1', 'user3'],
    comments: [
      {
        id: 'c3',
        author: {
          id: 'user1',
          name: 'Maria Silva',
          email: 'maria@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
        },
        content: 'Parabéns! TypeScript muda tudo. Minha dica: pratique muito com projetos reais.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString()
      },
      {
        id: 'c4',
        author: {
          id: 'user2',
          name: 'João Pedro',
          email: 'joao@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
        },
        content: 'Recomendo o livro "Programming TypeScript". É excelente!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
      }
    ]
  },
  {
    id: '5',
    author: {
      id: 'user5',
      name: 'Beatriz Santos',
      email: 'beatriz@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beatriz'
    },
    content: 'Dica do dia: sempre faça backup do seu código! Aprendi da maneira difícil hoje... 😅💾',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 67,
    likedBy: ['user1', 'user2', 'user3', 'user4'],
    comments: []
  }
];
