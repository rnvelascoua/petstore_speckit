import { useState } from 'react'
import { IconButton, Badge } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

export default function CartButton() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        sx={{ marginLeft: 'auto' }}
      >
        <Badge badgeContent={totalItems} color="error" invisible={totalItems === 0}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
