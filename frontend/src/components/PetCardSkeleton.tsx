import { Card, CardContent, Skeleton, Box } from '@mui/material'

export default function PetCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <Skeleton variant="rectangular" height={192} />
      <CardContent className="flex flex-col gap-2">
        <Box className="flex items-center justify-between">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rounded" width={70} height={24} />
        </Box>
        <Skeleton variant="text" width="80%" />
        <Box className="flex items-center justify-between mt-auto pt-2">
          <Skeleton variant="text" width={60} height={28} />
          <Skeleton variant="rounded" width={90} height={32} />
        </Box>
      </CardContent>
    </Card>
  )
}
