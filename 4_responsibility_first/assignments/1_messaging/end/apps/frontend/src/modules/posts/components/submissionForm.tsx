import { useState } from "react";
import { Types } from '@dddforum/api/posts'

interface SubmissionFormProps {
  onSubmit: (data: { title: string; content: string; link?: string }) => void;
  isSubmitting: boolean;
  error: string | null;
  canPost: boolean;
  disabledMessage?: string;
}

export const SubmissionForm = ({ 
  onSubmit, 
  isSubmitting, 
  error,
  canPost,
  disabledMessage 
}: SubmissionFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [postType, setPostType] = useState<Types.PostType>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, link: link || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="submission-form">
      <h2>New submission</h2>
      {!canPost && disabledMessage && (
        <><div className="warning-message">{disabledMessage}</div><br/></>
      )}
      <h2>Title</h2>
      <input
        type="text"
        placeholder="Enter the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!canPost}
      />

      <div className="flex gap-2 items-center mt-4 mb-2">
        <h2 
          className={`cursor-pointer px-3 py-1 rounded ${postType === 'text' ? 'bg-blue-500 text-white selected-post-type' : 'de-selected-post-type hover:bg-gray-100'}`}
          onClick={() => setPostType('text')}
        >
          Text
        </h2>
        <h2>&nbsp;|&nbsp;</h2>
        <h2 
          className={`cursor-pointer px-3 py-1 rounded ${postType === 'link' ? 'bg-blue-500 text-white selected-post-type' : 'de-selected-post-type hover:bg-gray-100'}`}
          onClick={() => setPostType('link')}
        >
          Link
        </h2>
      </div>

      {postType === 'link' ? (
        <input
          type="text"
          placeholder="Enter link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          disabled={!canPost}
          className="w-full p-2 border rounded mb-4"
        />
      ) : (
        <textarea
          placeholder="Write a post!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!canPost}
          className="w-full p-2 border rounded min-h-[150px] mb-4"
        />
      )}
      
      {error && <div className="error-message">{error}</div>}
      <button 
        type="submit" 
        disabled={isSubmitting || !canPost}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
      >
        {isSubmitting ? "Submitting..." : "Submit post"}
      </button>
    </form>
  );
}; 