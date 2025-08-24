import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		// For MVP: Return mock response
		// In production: Upload to IPFS (Pinata)
		const mockIpfsHash = 'Qm' + Math.random().toString(36).substring(2, 15)

		return NextResponse.json({
			success: true,
			ipfsHash: mockIpfsHash,
			url: `https://ipfs.io/ipfs/${mockIpfsHash}`,
			filename: file.name,
			size: file.size,
		})
	} catch (error) {
		console.error('Upload error:', error)
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
	}
}
