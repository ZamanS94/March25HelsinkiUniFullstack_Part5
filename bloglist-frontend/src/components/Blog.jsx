import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Do you want to delete "${blog.title}"?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}<button onClick={handleLike}>like</button></p>
          <p>{blog.author}</p>
          {blog.author === user.name && <button onClick={handleDelete}>delete</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
