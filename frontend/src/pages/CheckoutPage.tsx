import { useState, useEffect } from 'react'
import {
  Container, AppBar, Toolbar, Typography, Box, Grid, TextField,
  Button, Card, CardContent, Divider, CircularProgress
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useCart } from '../context/CartContext'
import CartButton from '../components/CartButton'

const PLACEHOLDER = '/placeholder-pet.svg'
const TAX_RATE = 0.08

interface FormFields {
  fullName: string
  email: string
  cardNumber: string
  expiry: string
  cvv: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormFields>({
    fullName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (items.length === 0) navigate('/', { replace: true })
  }, [items, navigate])

  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
    if (!form.expiry.trim()) newErrors.expiry = 'Expiry date is required'
    if (!form.cvv.trim()) newErrors.cvv = 'CVV is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (field === 'cardNumber') value = formatCardNumber(value)
    if (field === 'expiry') value = formatExpiry(value)
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = () => {
    if (!validate()) return
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      navigate('/order-success')
    }, 2000)
  }

  const orderSummary = (
    <Card variant="outlined">
      <CardContent className="flex flex-col gap-3">
        <Typography variant="h6" className="font-bold">Order Summary</Typography>
        <Divider />
        {items.map((item) => (
          <Box key={item.id} className="flex items-center gap-3">
            <img
              src={item.photoUrl || PLACEHOLDER}
              alt={item.name}
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
            />
            <Box className="flex-1 min-w-0">
              <Typography variant="body2" className="font-semibold truncate">{item.name}</Typography>
              <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
            </Box>
            <Typography variant="body2" className="font-semibold whitespace-nowrap">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
        <Divider />
        <Box className="flex justify-between">
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="body2">Tax (8%)</Typography>
          <Typography variant="body2">${tax.toFixed(2)}</Typography>
        </Box>
        <Divider />
        <Box className="flex justify-between">
          <Typography variant="subtitle1" className="font-bold">Total</Typography>
          <Typography variant="subtitle1" className="font-bold text-green-700">${total.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Button variant="contained" fullWidth size="large" disabled>
            Place Order
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" className="font-bold tracking-wide">🐾 Petstore</Typography>
          <CartButton />
        </Toolbar>
      </AppBar>

      {processing && (
        <Box
          sx={{
            position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}
        >
          <Box className="flex flex-col items-center gap-3 bg-white rounded-xl p-8 shadow-xl">
            <CircularProgress size={56} />
            <Typography variant="body1">Processing payment…</Typography>
          </Box>
        </Box>
      )}

      <Container maxWidth="lg" className="py-8">
        <Breadcrumbs className="mb-6">
          <Link component={RouterLink} to="/" underline="hover" color="inherit">Catalogue</Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>

        <Typography variant="h4" className="font-bold mb-6">Checkout</Typography>

        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined">
              <CardContent className="flex flex-col gap-4">
                <Typography variant="h6" className="font-bold">Payment Details</Typography>
                <Typography variant="caption" color="text.secondary">
                  This is a simulated payment — no real charges will be made.
                </Typography>

                <TextField
                  label="Full Name"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                />
                <TextField
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={handleChange('cardNumber')}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  fullWidth
                  required
                  inputProps={{ maxLength: 19 }}
                />
                <Box className="flex gap-4">
                  <TextField
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={handleChange('expiry')}
                    error={!!errors.expiry}
                    helperText={errors.expiry}
                    fullWidth
                    required
                    inputProps={{ maxLength: 5 }}
                  />
                  <TextField
                    label="CVV"
                    placeholder="123"
                    type="password"
                    value={form.cvv}
                    onChange={handleChange('cvv')}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    fullWidth
                    required
                    inputProps={{ maxLength: 3 }}
                  />
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={processing}
                  >
                    Place Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={5}>
            {orderSummary}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
