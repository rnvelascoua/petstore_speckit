import { useEffect, useRef } from 'react'
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function generateOrderRef(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const orderRef = useRef(generateOrderRef())

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" className="font-bold tracking-wide">🐾 Petstore</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" className="py-16">
        <Box className="flex flex-col items-center gap-6 text-center">
          <CheckCircleIcon sx={{ fontSize: 96, color: 'success.main' }} />
          <Typography variant="h4" className="font-bold">Order Placed Successfully!</Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you for your purchase! Your new companion is on the way. 🐾
          </Typography>
          <Box className="bg-gray-100 rounded-xl px-6 py-4">
            <Typography variant="caption" color="text.secondary" display="block">
              Order Reference
            </Typography>
            <Typography variant="h5" className="font-mono font-bold tracking-widest">
              #{orderRef.current}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            A confirmation email will be sent to you shortly (simulation only).
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    </>
  )
}
