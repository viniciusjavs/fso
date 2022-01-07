import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('shows title and author but hides url and likes', () => {
  const blog = {
    title: 'C++11: The Rule of the Big Five',
    author: 'Cline, Lomow, Girou',
    url: 'https://www.feabhas.com/sites/default/files/2016-06/Rule%20of%20the%20Big%20Five.pdf',
    likes: 42
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleUpdate={mockHandler} handleRemove={mockHandler} />
  )

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)

  expect(component.container.querySelector('.basic-blog')).not.toHaveStyle(
    'display: none'
  )

  expect(component.container.querySelector('.full-blog')).toHaveStyle(
    'display: none'
  )
})
