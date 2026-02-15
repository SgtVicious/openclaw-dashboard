import { render, screen } from '@testing-library/react'
import MetricsGrid from '../metrics-grid'

describe('MetricsGrid', () => {
  it('renders all metric cards', () => {
    render(<MetricsGrid />)
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$124,563')).toBeInTheDocument()
    expect(screen.getByText('+12.5%')).toBeInTheDocument()
    
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('2,543')).toBeInTheDocument()
    expect(screen.getByText('+8.2%')).toBeInTheDocument()
    
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
    expect(screen.getByText('3.24%')).toBeInTheDocument()
    expect(screen.getByText('-2.1%')).toBeInTheDocument()
    
    expect(screen.getByText('System Health')).toBeInTheDocument()
    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('+0.1%')).toBeInTheDocument()
  })

  it('renders correct icons for each metric', () => {
    render(<MetricsGrid />)
    
    // Check for icons (assuming they're rendered as SVG elements)
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons.length).toBeGreaterThan(0)
  })

  it('displays trend indicators correctly', () => {
    render(<MetricsGrid />)
    
    // Check for upward trends
    const upTrends = screen.getAllByText('+12.5%')
    expect(upTrends.length).toBeGreaterThan(0)
    
    // Check for downward trends
    const downTrends = screen.getAllByText('-2.1%')
    expect(downTrends.length).toBeGreaterThan(0)
  })
})