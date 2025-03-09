import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={handleBlogSubmit}>
        <div>
          <label>
              Title:
            <input
              id='title'
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
              Author:
            <input
              id='author'
              value={author}
              onChange={event => setAuthor(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
              URL:
            <input
              id='url'
              value={url}
              onChange={event => setUrl(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
