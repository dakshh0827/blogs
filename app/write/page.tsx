'use client'

import React, { useEffect, useState, useRef } from 'react'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

const TOOLBAR_BUTTONS = [
  { command: 'fontSize', value: '1', label: 'S', className: 'text-xs', title: 'Small', type: 'size' },
  { command: 'fontSize', value: '3', label: 'M', className: 'text-sm', title: 'Medium', type: 'size' },
  { command: 'fontSize', value: '5', label: 'L', className: 'text-lg', title: 'Large', type: 'size' },
  { command: 'justifyLeft', label: '⇤', className: '', title: 'Align Left', type: 'action' },
  { command: 'justifyCenter', label: '⇥', className: '', title: 'Align Center', type: 'action' },
  { command: 'justifyRight', label: '⇥', className: '', title: 'Align Right', type: 'action' },
]

const BlogWritePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  // Active formatting states
  const [activeFormats, setActiveFormats] = useState({
    fontSize: '3' // default medium size
  })

  // Add uploaded images to a separate array
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Add image to the images array
  const addUploadedImage = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl])
  }

  // Remove image from the images array
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Clear all form data
  const clearForm = () => {
    setTitle('')
    setCategory('')
    setContent('')
    setImageUrl(null)
    setUploadedImages([])
    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
    // Reset formatting
    setActiveFormats({ fontSize: '3' })
  }

  useEffect(() => {
    const upload = async () => {
      if (!file) return

      setIsUploading(true)
      const uploadingToast = showLoading('Uploading image...')

      const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })
      }

      try {
        const base64 = await toBase64(file)

        // Simulate upload since we don't have the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        const simulatedUrl = `data:${file.type};base64,${base64.split(',')[1]}`
        
        dismissToast(uploadingToast)
        setImageUrl(simulatedUrl)
        addUploadedImage(simulatedUrl)
        showSuccess('Image uploaded successfully!')
      } catch (err) {
        dismissToast(uploadingToast)
        console.error('Upload error:', err)
        showError('Failed to upload image. Please try again.')
      } finally {
        setFile(null)
        setIsUploading(false)
      }
    }

    if (file) {
      upload()
    }
  }, [file])

  // Apply current formatting to the cursor position
  const applyCurrentFormatting = () => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    
    // Create a formatted span element
    const span = document.createElement('span')
    
    // Apply font size
    const sizeMap = { '1': '12px', '3': '16px', '5': '20px' }
    span.style.fontSize = sizeMap[activeFormats.fontSize as keyof typeof sizeMap]
    
    // Insert a zero-width space to maintain cursor position
    span.appendChild(document.createTextNode('\u200B'))
    
    try {
      range.insertNode(span)
      range.setStart(span.firstChild!, 1)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } catch (error) {
      console.error('Error applying formatting:', error)
    }
  }

  // Handle text formatting
  const formatText = (command: string, value?: string, type?: string) => {
    if (!editorRef.current) return

    editorRef.current.focus()

    if (type === 'size') {
      // Set the font size state
      setActiveFormats(prev => ({
        ...prev,
        fontSize: value || '3'
      }))
      
      // Apply to selected text if any
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        document.execCommand('fontSize', false, value)
        setContent(editorRef.current.innerHTML)
      } else {
        // Apply formatting to future text
        setTimeout(() => applyCurrentFormatting(), 0)
      }
    } else {
      // Execute action immediately (for alignment)
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        return
      }

      try {
        document.execCommand(command, false, value)
        setContent(editorRef.current.innerHTML)
      } catch (error) {
        console.error('Format command failed:', error)
      }
    }
  }

  // Handle content changes
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML)
  }

  // Handle input events - simplified approach
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const container = range.startContainer

    // If we're in a text node, wrap it with current formatting
    if (container.nodeType === Node.TEXT_NODE) {
      const textNode = container as Text
      const parent = textNode.parentElement
      
      // Check if parent already has the required formatting
      if (parent && parent.tagName.toLowerCase() === 'span') {
        const computedStyle = window.getComputedStyle(parent)
        const sizeMap = { '1': '12px', '3': '16px', '5': '20px' }
        const expectedSize = sizeMap[activeFormats.fontSize as keyof typeof sizeMap]
        
        if (computedStyle.fontSize !== expectedSize) {
          parent.style.fontSize = expectedSize
        }
      }
    }

    setContent(e.currentTarget.innerHTML)
  }

  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      
      const range = selection.getRangeAt(0)
      
      // Insert line break
      const br = document.createElement('br')
      range.insertNode(br)
      
      // Position cursor after the break and apply current formatting
      const newRange = document.createRange()
      newRange.setStartAfter(br)
      newRange.collapse(true)
      
      selection.removeAllRanges()
      selection.addRange(newRange)
      
      // Apply current formatting for the new line
      setTimeout(() => applyCurrentFormatting(), 0)
      
      setContent(editorRef.current!.innerHTML)
    } else if (e.key === ' ') {
      // Let space be handled normally, but ensure formatting is applied
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          applyCurrentFormatting()
        }
      }, 0)
    }
  }

  // Handle focus events to ensure formatting is applied
  const handleFocus = () => {
    setTimeout(() => applyCurrentFormatting(), 0)
  }

  // Handle Enter key on title input
  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorRef.current?.focus()
    }
  }

  // Handle file upload
  const handleFileUpload = () => {
    if (isUploading) return
    
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files[0]) {
        setFile(files[0])
      }
    }
    input.click()
  }

  // Handle mouse down on toolbar buttons to prevent losing focus
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Convert HTML content to plain text for description
  const getPlainTextFromHTML = (html: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const handleBlogSubmit = async () => {
    // Validation with toast notifications
    if (!title.trim()) {
      showError('Please enter a title for your blog post.')
      return
    }

    if (!category.trim()) {
      showError('Please enter a category for your blog post.')
      return
    }

    if (!content.trim() || content === '<br>') {
      showError('Please write some content for your blog post.')
      return
    }

    setIsPublishing(true)
    const publishingToast = showLoading('Publishing your blog post...')

    try {
      const blogData = {
        title: title.trim(),
        slug: slugify(title),
        desc: content,
        catSlug: slugify(category), // Convert category to slug format
        img: imageUrl || (uploadedImages.length > 0 ? uploadedImages[0] : null), // Use first uploaded image as main image
      }

      console.log('Submitting blog data:', blogData)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      })

      dismissToast(publishingToast)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showError(errorData.error || errorData.message || 'Failed to publish blog post. Please try again.')
        return
      }

      const result = await response.json()
      console.log('Blog published successfully:', result)
      
      // Show success message with toast
      showSuccess('Blog published successfully!')
      
      // Clear the form
      clearForm()
      
    } catch (error) {
      dismissToast(publishingToast)
      console.error('Error publishing blog:', error)
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showError('Network error: Please check your internet connection and try again.')
      } else {
        showError(error instanceof Error ? error.message : 'An unexpected error occurred while publishing. Please try again.')
      }
    } finally {
      setIsPublishing(false)
    }
  }

  // Check if a button should be highlighted
  const isButtonActive = (btn: any) => {
    if (btn.type === 'size') {
      return activeFormats.fontSize === btn.value
    }
    return false
  }

  return (
    <div className="relative mb-2 bg-background">
      {/* Main Write Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Title and Category */}
        <div className='ml-15 flex gap-4 items-center'>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="Title"
            className="flex-1 text-4xl font-bold bg-transparent border-none outline-none text-foreground mb-6 placeholder:text-muted-foreground h-20 py-4"
            disabled={isPublishing}
          />
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Category"
            className="w-48 text-lg font-medium bg-transparent border border-border rounded-md px-3 py-2 outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors ml-auto"
            disabled={isPublishing}
          />
        </div>

        {/* Main Flex: Toolbar (vertical) + Content */}
        <div className="flex flex-row gap-6">
          {/* Vertical Toolbar */}
          <div className="flex flex-col gap-2 items-center py-4 pr-4 border-r border-border min-w-[48px] -ml-8">
            {/* Image Upload */}
            <button
              onClick={handleFileUpload}
              onMouseDown={handleMouseDown}
              disabled={isUploading || isPublishing}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                isUploading || isPublishing
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
              }`}
              title={isUploading ? 'Uploading...' : 'Upload Image'}
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
            
            {/* Formatting Buttons */}
            {TOOLBAR_BUTTONS.map((btn, idx) => {
              const isActive = isButtonActive(btn)
              return (
                <button
                  key={idx}
                  onClick={() => formatText(btn.command, btn.value, btn.type)}
                  onMouseDown={handleMouseDown}
                  disabled={isPublishing}
                  className={`w-10 h-10 flex items-center justify-center border rounded-md transition-colors cursor-pointer ${btn.className} ${
                    isActive 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                      : 'border-border hover:bg-accent hover:text-accent-foreground'
                  } ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={btn.title + (btn.type === 'toggle' || btn.type === 'size' ? (isActive ? ' (ON)' : ' (OFF)') : '')}
                >
                  {btn.label}
                </button>
              )
            })}
          </div>

          {/* Content Editor */}
          <div className="flex-1">
            <div
              ref={editorRef}
              contentEditable={!isPublishing}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              className={`w-full p-4 bg-background text-foreground overflow-auto outline-none border-none min-h-[500px] prose prose-lg max-w-none ${
                isPublishing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ lineHeight: '1.6' }}
              data-placeholder="Tell your story..."
              suppressContentEditableWarning={true}
            />
          </div>
        </div>

        {/* Active Formatting Indicator */}
        <div className="mt-4 pl-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active formatting:</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
              Size: {activeFormats.fontSize === '1' ? 'Small' : activeFormats.fontSize === '3' ? 'Medium' : 'Large'}
            </span>
          </div>
        </div>

        {/* Uploaded Images Section */}
        {uploadedImages.length > 0 && (
          <div className="mt-6 pl-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Uploaded Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-48 object-contain rounded-lg border border-border"
                  />
                  <button
                    onClick={() => removeUploadedImage(index)}
                    disabled={isPublishing}
                    className={`absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600 ${
                      isPublishing ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 pl-6">
          <button 
            className={`ml-auto px-6 py-3 rounded-md transition-colors font-medium flex items-center gap-2 ${
              isPublishing
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
            }`}
            onClick={handleBlogSubmit}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Blog'
            )}
          </button>
        </div>
      </div>

      {/* Custom CSS for placeholder */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          font-style: italic;
        }
        [contenteditable]:focus:before {
          content: '';
        }
      `}</style>
    </div>
  )
}

export default BlogWritePage
