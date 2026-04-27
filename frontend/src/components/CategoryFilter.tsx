import { ToggleButton, ToggleButtonGroup, Typography, Box, Button } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

const CATEGORIES = [
  { value: 'DOG', label: '🐶 Dogs' },
  { value: 'CAT', label: '🐱 Cats' },
  { value: 'BIRD', label: '🐦 Birds' },
  { value: 'FISH', label: '🐟 Fish' },
]

export const VALID_CATEGORIES = CATEGORIES.map((c) => c.value)

export default function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selected = searchParams.getAll('category')

  const handleChange = (_: React.MouseEvent, values: string[]) => {
    const next = new URLSearchParams(searchParams)
    next.delete('category')
    next.delete('page')
    values.forEach((v) => next.append('category', v))
    setSearchParams(next)
  }

  const handleClearAll = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('category')
    next.delete('page')
    setSearchParams(next)
  }

  return (
    <Box className="flex flex-col gap-2">
      <Box className="flex items-center gap-3">
        <Typography variant="subtitle2" color="text.secondary">Filter by Category</Typography>
        {selected.length > 0 && (
          <Button size="small" onClick={handleClearAll} color="inherit" sx={{ fontSize: '0.75rem', minWidth: 0, px: 1 }}>
            Clear All
          </Button>
        )}
      </Box>
      <ToggleButtonGroup
        value={selected}
        onChange={handleChange}
        aria-label="Filter by pet category"
        color="primary"
        size="small"
      >
        {CATEGORIES.map(({ value, label }) => (
          <ToggleButton key={value} value={value} aria-label={label}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}
