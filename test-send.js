import fs from 'fs'

// Usage: node test-send.js path/to/photo.jpg [http://localhost:3000/api/gerar-face]
const [,, imagePath, targetUrl = 'http://localhost:3000/api/gerar-face'] = process.argv

if (!imagePath) {
  console.error('Usage: node test-send.js path/to/photo.jpg [url]')
  process.exit(1)
}

async function main() {
  try {
    const buffer = fs.readFileSync(imagePath)
    const mime = 'image/jpeg'
    const base64 = buffer.toString('base64')
    const payload = {
      imageBase64: `data:${mime};base64,${base64}`,
      mimeType: mime
    }

    console.log('Sending image:', imagePath)
    console.log('Target URL:', targetUrl)

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const text = await res.text()
    console.log('\n=== SERVER RESPONSE ===')
    console.log(text)
    console.log('=== END RESPONSE ===\n')
  } catch (err) {
    console.error('Error sending image:', err)
    process.exit(1)
  }
}

main()
