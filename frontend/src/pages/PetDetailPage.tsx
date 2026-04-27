import {
  Container, Box, Typography, Chip, Button, Breadcrumbs, Link,
  CircularProgress, Divider, AppBar, Toolbar, Grid, Snackbar
} from '@mui/material'
import { useNavigate, useParams, Link as RouterLink, useSearchParams } from 'react-router-dom'
import { usePetDetail } from '../hooks/usePetDetail'
import ErrorState from '../components/ErrorState'
import CartButton from '../components/CartButton'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const PLACEHOLDER = '/placeholder-pet.svg'

const categoryEmoji: Record<string, string> = {
  DOG: '🐶',
  CAT: '🐱',
  BIRD: '🐦',
  FISH: '🐟',
}

function formatPrice(price: number | null): string | null {
  if (price == null || price === 0) return null
  return `$${price.toFixed(2)}`
}

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: pet, isLoading, isError, error } = usePetDetail(id ?? '')
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const [snackOpen, setSnackOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const { addItem } = useCart()

  const catalogueLink = `/?${searchParams.toString()}`

  if (isLoading) {
    return (
      <>
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Typography variant="h6" className="font-bold tracking-wide">🐾 Petstore</Typography>
            <CartButton />
          </Toolbar>
        </AppBar>
        <Box className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress size={56} />
        </Box>
      </>
    )
  }

  if (isError || !pet) {
    return (
      <>
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Typography variant="h6" className="font-bold tracking-wide">🐾 Petstore</Typography>
            <CartButton />
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className="py-16">
          <ErrorState
            message={(error as Error)?.message ?? 'Pet not found.'}
            onRetry={() => navigate(-1)}
          />
        </Container>
      </>
    )
  }

  const primaryPhoto = pet.photos.find((p) => p.isPrimary)?.url ?? pet.primaryPhotoUrl ?? PLACEHOLDER
  const displayPhoto = activePhoto ?? primaryPhoto
  const formattedPrice = formatPrice(pet.price)

  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" className="font-bold tracking-wide">🐾 Petstore</Typography>
          <CartButton />
        </Toolbar>
      </AppBar>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <Container maxWidth="lg" className="py-8">
        <Breadcrumbs className="mb-6">
          <Link component={RouterLink} to={catalogueLink} underline="hover" color="inherit">
            Catalogue
          </Link>
          <Typography color="text.primary">{pet.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Image column */}
          <Grid item xs={12} md={6}>
            <img
              src={displayPhoto}
              alt={pet.name}
              className="w-full rounded-xl object-cover shadow-md"
              style={{ maxHeight: 480 }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
            />
            {pet.photos.length > 1 && (
              <Box className="flex gap-2 mt-3 flex-wrap">
                {pet.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo.url}
                    alt={`${pet.name} photo ${i + 1}`}
                    onClick={() => setActivePhoto(photo.url)}
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer border-2 hover:border-blue-500 transition-colors"
                    style={{ borderColor: displayPhoto === photo.url ? '#1976d2' : 'transparent' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Details column */}
          <Grid item xs={12} md={6}>
            <Box className="flex flex-col gap-4">
              <Box className="flex items-center gap-3">
                <Typography variant="h4" component="h1" className="font-bold">
                  {pet.name}
                </Typography>
                <Chip
                  label={`${categoryEmoji[pet.category]} ${pet.category}`}
                  color="primary"
                  size="medium"
                />
              </Box>

              <Box className="flex gap-4 flex-wrap">
                <Typography variant="body1" color="text.secondary">
                  <strong>Breed:</strong> {pet.breed}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Age:</strong> {pet.ageMonths < 12
                    ? `${pet.ageMonths} month${pet.ageMonths !== 1 ? 's' : ''}`
                    : `${Math.floor(pet.ageMonths / 12)} yr ${pet.ageMonths % 12} mo`}
                </Typography>
              </Box>

              <Divider />

              <Typography variant="body1" className="leading-relaxed">
                {pet.description}
              </Typography>

              <Divider />

              <Box className="flex items-center justify-between">
                {formattedPrice ? (
                  <Typography variant="h5" className="font-bold text-green-700">
                    {formattedPrice}
                  </Typography>
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    Contact us for pricing
                  </Typography>
                )}
                <Chip
                  label={pet.available ? '✅ Available' : '❌ Unavailable'}
                  color={pet.available ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                disabled={!pet.available}
                fullWidth
                className="mt-2"
                onClick={() => { addItem(pet); setSnackOpen(true) }}
                aria-label={pet.available ? `Add ${pet.name} to cart` : `${pet.name} is currently unavailable`}
              >
                {pet.available ? '🛒 Add to Cart' : 'Currently Unavailable'}
              </Button>

              <Button variant="outlined" component={RouterLink} to={catalogueLink}>
                ← Back to Catalogue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        message={`Added ${pet.name} to cart!`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}
