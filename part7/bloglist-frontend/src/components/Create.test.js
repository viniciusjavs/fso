import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Create from './Create'

describe('<Create />', () => {
  const handleCreate = jest.fn()

  const component = render(<Create handleCreate={handleCreate} />)

  test('creating a new blog', () => {
    const newBlog = {
      title: 'C++11: The Rule of the Big Five',
      author: 'Cline, Lomow, Girou',
      url: 'https://www.feabhas.com/sites/default/files/2016-06/Rule%20of%20the%20Big%20Five.pdf',
    }
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    const form = component.container.querySelector('form')

    const components = [title, author, url]
    components.forEach((element, key) => {
      fireEvent.change(element, {
        target: { value: Object.values(newBlog)[key] },
      })
    })

    fireEvent.submit(form)

    expect(handleCreate).toHaveBeenCalledTimes(1)
    expect(handleCreate.mock.calls[0][0]).toEqual(newBlog)
  })
})
