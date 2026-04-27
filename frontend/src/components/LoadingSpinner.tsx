import { CircularProgress, Box } from '@mui/material'

export default function LoadingSpinner() {
  return (
    <Box
      className="flex justify-center items-center py-16"
      role="status"
      aria-label="Loading pets"
    >
      <CircularProgress size={48} />
    </Box>
  )
}
