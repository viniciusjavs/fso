import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'C++11: The Rule of the Big Five',
    author: 'Cline, Lomow, Girou',
    url: 'https://www.feabhas.com/sites/default/files/2016-06/Rule%20of%20the%20Big%20Five.pdf',
    likes: 42
  }
  let mockHandler
  let component

  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <Blog blog={blog} handleUpdate={mockHandler} handleRemove={mockHandler} />
    )
  })

  test('shows title and author but hides url and likes', () => {
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

  test('clicking view button displays url and likes', () => {
    const button = component.container.querySelector('button')
    fireEvent.click(button)

    expect(component.container.querySelector('.basic-blog')).toHaveStyle(
      'display: none'
    )

    expect(component.container.querySelector('.full-blog')).not.toHaveStyle(
      'display: none'
    )
  })

  test('ensures the like button works multiple times', () => {
    const button = component.container.querySelector('button')
    fireEvent.click(button)

    const like = component.getByText('like')
    for (let i = 0; i < 2; ++i) {
      fireEvent.click(like)
    }

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})