import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const mockCreateBlog = vi.fn()
  
    render(<BlogForm createBlog={mockCreateBlog} />)
  
    const user = userEvent.setup()
  
    const titleInput = screen.getByLabelText('Title:')
    const authorInput = screen.getByLabelText('Author:')
    const urlInput = screen.getByLabelText('URL:')
    const saveButton = screen.getByText('save')
  
    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'www.test.com')

    await user.click(saveButton)

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'www.test.com'
    })
  })