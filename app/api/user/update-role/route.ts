export async function POST(request: Request) {
  try {
    const { role } = await request.json()

    if (!['user', 'admin'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Client-side auth is used, so update happens on client
    return Response.json({ success: true, role })
  } catch (error) {
    console.error('Role update error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
