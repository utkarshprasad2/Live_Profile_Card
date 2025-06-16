import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Home />)
    // Add your test assertions here based on your home page content
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
}) 