import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'Component testing',
    author: 'TEST AUTHOR',
    likes: 10,
    url: 'www.test.com'
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('TEST AUTHOR')).toBeDefined()

  expect(screen.queryByText('www.test.com')).toBeNull()
  expect(screen.queryByText('likes: 10')).toBeNull()
})

test('revealing blog details', async () => {
  const blog = {
    title: 'Component testing',
    author: 'TEST AUTHOR',
    likes: 10,
    url: 'www.test.com'
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  expect(screen.getByText('www.test.com')).toBeDefined()
  expect(screen.getByText('likes: 10')).toBeDefined()
})

test('like button twice calls event handler twice', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'TEST AUTHOR',
      likes: 10,
      url: 'www.test.com'
    }

    const mockUpdateBlog = vi.fn()
  
    render(<Blog blog={blog} updateBlog={mockUpdateBlog} />)
  
    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)
    
    const likeButton = screen.getByText('like')
  
    await user.click(likeButton)
    await user.click(likeButton)
  
    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })