import React from 'react'
import MenuList from './MenuList.server'
import CommentsSection from './CommentsSection'

interface PostPageBottomContainerProps {
  content: string
  postSlug: string
}

const PostPageBottomContainer: React.FC<PostPageBottomContainerProps> = ({
  content,
  postSlug,
}) => {
  console.log("content: ", postSlug);
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-8">
      {/* Blog Content and Comments (2/3) */}
      <div className="w-full md:w-2/3">
        {/* Blog Content - Server rendered */}
        <div className="mb-8">
          <div 
            className="text-muted-foreground prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content ?? "" }}
          />
        </div>

        {/* Comments Section - Client rendered */}
        <CommentsSection postSlug={postSlug} />
      </div>
      
      {/* MenuList (1/3) - Server rendered */}
      <div className="w-full md:w-1/3">
        <MenuList />
      </div>
    </div>
  )
}

export default PostPageBottomContainer
