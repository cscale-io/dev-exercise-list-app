import React, { useRef, useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import Image from 'next/image'

interface FileDropZoneProps {
  onFileSelect: (files: FileList) => void
}

export default function FileDropZone({ onFileSelect }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      onFileSelect(files)
      e.dataTransfer.clearData()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      onFileSelect(files)
    }
  }

  return (
    <Box>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
      <Paper
        elevation={dragging ? 6 : 2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        sx={{
          padding: 4,
          textAlign: 'center',
          border: '2px dashed #aaa',
          backgroundColor: dragging ? '#f0f0f0' : '#fff',
          cursor: 'pointer',
        }}
      >
        <Typography variant="h6">Drag and drop a file here</Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select
        </Typography>

        {selectedFile && (
          <Box mt={3}>
            {selectedFile.type.startsWith('image/') ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Selected image"
                width={400}
                height={300}
                style={{ borderRadius: 8, objectFit: 'cover' }}
              />
            ) : (
              <Typography mt={2}>
                📄 Selected file: <strong>{selectedFile.name}</strong>
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  )
}
