import { Appbar } from "../components/AppBar";
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton"
import { useBlogs } from "../hooks"

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  if(loading){
    return <div className="flex flex-col justify-center items-center">
      <BlogSkeleton />
      <BlogSkeleton />
      <BlogSkeleton />
      <BlogSkeleton />
      <BlogSkeleton />
      <BlogSkeleton />
      <BlogSkeleton />
    </div>
  }

  return (
    <div>
      <Appbar />
      <div>
        <div className="flex flex-col justify-center items-center">
          { blogs && blogs.map(blog => {
            return <BlogCard 
              id={blog.id} 
              authorName={blog.author.name || "Anonymous"} 
              title={blog.title}
              content={blog.content}
              publishedDate={"11 Nov 2024"}
            />
          })}
        </div>
      </div>
    </div>
  )
}
