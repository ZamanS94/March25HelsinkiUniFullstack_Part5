import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglebale'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const referenceFormBlog = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userDataLocal')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'userDataLocal', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    referenceFormBlog.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBLog => {
        setBlogs(blogs.concat(returnedBLog))
      })
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
    } catch (error) {
      setErrorMessage('Error updating blog likes')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      setErrorMessage('Error deleting blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3>Blog View</h3>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={() => {window.localStorage.clear(); setUser(null) }}>logout</button>
        <Togglable buttonLabel='new blog' ref={referenceFormBlog}>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>

        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} 
            blog={blog} 
            updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
          )}
      </div>}
    </div>
  )
}

export default App
