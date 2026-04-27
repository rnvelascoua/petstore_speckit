import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box className="flex flex-col items-center justify-center py-16 gap-4 text-red-400">
      <ErrorOutlineIcon sx={{ fontSize: 64 }} />
      <Typography variant="h6" color="error">{message}</Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>Retry</Button>
      )}
    </Box>
  )
}
