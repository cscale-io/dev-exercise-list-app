'use client'

import { addItemAction } from '@/app/actions/item'
import { formatErrorMessage } from '@/lib/utils'
import { Add } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import FileDropZone from './FileInput'

interface CategoryResponse {
  id: string
  name: string
}

export const AddItemButton = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) {
      fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((error) => console.log('Failed to fetch categories', error))
    }
  }, [open])

  const handleFileSelect = (files: FileList) => {
    setSelectedFile(files[0]) 
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedFile(null) 
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() 

    const formData = new FormData(e.currentTarget)
    if (selectedFile) {
      formData.append('photo', selectedFile)
    }

    try {
      await addItemAction(formData)
      enqueueSnackbar('Item added successfully', { variant: 'success' })
      handleClose()
    } catch (error) {
      enqueueSnackbar(formatErrorMessage(error), { variant: 'error' })
    }
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" startIcon={<Add />}>
        Add item
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add an item to the list</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ my: 2 }}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  label="Category"
                  defaultValue=""
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField name="name" label="Name" fullWidth required />

              <TextField name="description" label="Description" fullWidth multiline rows={4} />

              <FileDropZone onFileSelect={handleFileSelect} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
