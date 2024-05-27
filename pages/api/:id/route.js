export async function GET() {
    return { type: 'GET', route: '/api/:id' };
}

export async function POST() {
    return { type: 'POST', route: '/api/:id' };
}

export async function PUT() {
    return { type: 'PUT', route: '/api/:id' };
}

// Should not be loaded as a route
export async function BAH() {
    return { type: 'BAH', route: '/api/:id' };
}