import { getItemDetails } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Paper, Typography } from '@mui/material'
import Image from 'next/image'

export default async function Page({ params }: { params: { id: string } }) {
  const authUser = await getCurrentAuthUser()
  const itemDetails = await getItemDetails(authUser, params.id)

  if (!itemDetails) {
    return (
      <Box p={4}>
        <Button href="/dashboard" startIcon={<ArrowBackIcon />}>
          Back to all items
        </Button>
        <Typography mt={4} color="text.secondary">
          Item not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 800, width: '100%' }}>
        <Button href="/dashboard" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
          Back to all items
        </Button>

        <Typography variant="h4" gutterBottom>
          {itemDetails.name}
        </Typography>

        <Typography
          variant="body1"
          color={itemDetails.description ? 'text.primary' : 'text.secondary'}
          gutterBottom
        >
          {itemDetails.description || 'No description'}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Category: {itemDetails.category.name}
        </Typography>

        {itemDetails.photoUrl && (
          <Box mt={3}>
            <Image
              src={itemDetails.photoUrl}
              alt={`Image of ${itemDetails.name}`}
              width={600}
              height={400}
              style={{
                borderRadius: 12,
                objectFit: 'cover',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  )
}
