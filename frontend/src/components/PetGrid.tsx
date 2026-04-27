import { Grid } from '@mui/material'
import PetCard from './PetCard'
import { PetSummary } from '../api/petsApi'

interface PetGridProps {
  pets: PetSummary[]
}

export default function PetGrid({ pets }: PetGridProps) {
  return (
    <Grid container spacing={3}>
      {pets.map((pet) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={pet.id}>
          <PetCard pet={pet} />
        </Grid>
      ))}
    </Grid>
  )
}
