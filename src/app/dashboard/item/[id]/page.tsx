import { getItemDetails } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Card, CardContent, CardMedia, Typography, Divider } from '@mui/material'

export default async function Page({ params }: { params: { id: string } }) {
  const authUser = getCurrentAuthUser()
  const itemDetails = await getItemDetails(authUser, params.id)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Button href={'/dashboard'} startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start", mb: 2 }}>
        Back to all items
      </Button>

      {itemDetails ? (
        <Card sx={{ maxWidth: 600, width: "100%", boxShadow: 3, borderRadius: 2 }}>
          {itemDetails.photoUrl && (
            <CardMedia
              component="img"
              image={itemDetails.photoUrl}
              alt={itemDetails.name}
              sx={{
                width: "100%",      
                height: "auto",      
                maxHeight: 400,     
                objectFit: "contain", 
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
          )}

          <CardContent>
            {/* Name */}
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="h4" gutterBottom>
              {itemDetails.name}
            </Typography>

            <Divider sx={{ my: 1 }} />

            {/* Category */}
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              {itemDetails?.category || 'No category'}
            </Typography>

            <Divider sx={{ my: 1 }} />

            {/* Description */}
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1" color={itemDetails.description ? 'text.primary' : 'text.secondary'}>
              {itemDetails.description || 'No description'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography color="text.secondary">Item not found</Typography>
      )}
    </Box>
  )
}
