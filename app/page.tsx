import React from 'react'

export default function HomePage() {
  return (
    <html>
      <body>
        <main style={{padding: '2rem', minHeight: '100vh'}}>
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>
            Canvas Board Editor
          </h1>
          <p style={{fontSize: '1.2rem', color: '#666'}}>
            Next.js 16 + shadcn/ui + Professional Canvas Workspace
          </p>
          <div style={{
            marginTop: '2rem', 
            padding: '2rem', 
            border: '2px dashed #3b82f6',
            borderRadius: '8px',
            minHeight: '400px'
          }}>
            Canvas ready for drag & drop elements
          </div>
        </main>
      </body>
    </html>
  )
}
