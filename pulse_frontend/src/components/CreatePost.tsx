import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageIcon, Smile } from 'lucide-react';

interface CreatePostProps {
  currentUser: any;
  onCreatePost: (content: string) => void;
}

export default function CreatePost({ currentUser, onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('');

  function handleSubmit() {
    if (content.trim()) {
      onCreatePost(content);
      setContent('');
    }
  }

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={currentUser?.avatar} />
          <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            placeholder="O que está acontecendo?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-lg p-0"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="rounded-full"
            >
              Pulsar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
