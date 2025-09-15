'use client'

import { AddCategoryButton } from '@/components/AddCategoryButton'
import { pluralize } from '@/lib/utils'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

type Category = {
  id: string
  name: string
  description?: string | null
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <Stack spacing={2} sx={{ maxWidth: 500, margin: '0 auto' }}>
      <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} size="small">
        Back
      </Button>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body1">
          You have{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {categories.length.toLocaleString()}{' '}
            {pluralize(categories.length, 'category', 'categories')}
          </Box>{' '}
          in your list
        </Typography>
        <AddCategoryButton />
      </Box>

      {/* Category list or message */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : categories.length === 0 ? (
        <Typography>No categories found.</Typography>
      ) : (
        <Box
          sx={{
            border: 1,
            borderColor: 'grey.200',
            borderRadius: 1,
          }}
        >
          <List disablePadding>
            {categories.map((category, index) => (
              <Box key={category.id}>
                <ListItem disablePadding>
                  <ListItemButton component={NextLink} href={`/dashboard/category/${category.id}`}>
                    <ListItemText primary={category.name} secondary={category.description || ''} />
                  </ListItemButton>
                </ListItem>
                {index < categories.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>
      )}
    </Stack>
  )
}
