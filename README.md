# Headless ERPNext Docker Setup

A production-ready Docker Compose setup for running ERPNext as a headless backend, optimized for ARM64 architecture (Apple Silicon M1/M2/M3) with full API access for Next.js or any frontend framework.

## Features

- ✅ **ARM64 Optimized**: Fully compatible with Apple Silicon (M1/M2/M3)
- ✅ **Headless Ready**: Pre-configured CORS and API access
- ✅ **Production Ready**: Includes all necessary services (Redis, MariaDB, Workers)
- ✅ **WebSocket Support**: Real-time updates via Socket.IO
- ✅ **Auto-configuration**: Automatic site creation and API setup
- ✅ **Next.js Integration**: Example code for connecting from Next.js

## Prerequisites

- Docker Desktop for Mac (with Apple Silicon support)
- Docker Compose v2.0+
- Node.js 18+ (for Next.js frontend)
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/rcdelacruz/headless-erpnext-docker.git
   cd headless-erpnext-docker
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Wait for initialization** (approximately 5 minutes)
   
   Monitor the setup progress:
   ```bash
   docker-compose logs -f create-site
   ```

4. **Access ERPNext**
   - Web UI: http://localhost:8080
   - API Endpoint: http://localhost:8080/api
   - WebSocket: ws://localhost:9000
   - Default credentials: `Administrator` / `admin`

## Configuration

### Environment Variables

Create a `.env` file to customize your setup:

```env
# ERPNext Configuration
SITE_NAME=erpnext.localhost
ADMIN_PASSWORD=admin
DB_ROOT_PASSWORD=admin

# Ports
WEB_PORT=8080
WEBSOCKET_PORT=9000
DB_PORT=3306

# CORS Settings (use specific domain in production)
CORS_ORIGIN=*
```

### Getting API Keys

After setup, generate API keys for your application:

```bash
docker-compose exec backend bench --site erpnext.localhost execute frappe.core.doctype.user.user.generate_keys --args '["Administrator"]'
```

## Next.js Integration

See the [nextjs-integration](./nextjs-integration) folder for a complete example of connecting to ERPNext from Next.js.

### Quick Example

```typescript
// lib/erpnext.ts
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add your API key
client.defaults.headers.common['Authorization'] = `token ${API_KEY}:${API_SECRET}`;

export default client;
```

## API Documentation

### Authentication

**Login**
```bash
curl -X POST http://localhost:8080/api/method/login \
  -H "Content-Type: application/json" \
  -d '{"usr":"Administrator","pwd":"admin"}'
```

**Using API Keys**
```bash
curl -H "Authorization: token api_key:api_secret" \
  http://localhost:8080/api/resource/Customer
```

### Common Endpoints

- `GET /api/resource/{doctype}` - List documents
- `GET /api/resource/{doctype}/{name}` - Get specific document
- `POST /api/resource/{doctype}` - Create document
- `PUT /api/resource/{doctype}/{name}` - Update document
- `DELETE /api/resource/{doctype}/{name}` - Delete document
- `POST /api/method/{method}` - Call server method

## Services

The setup includes the following services:

- **backend**: Main ERPNext application
- **frontend**: Nginx web server
- **websocket**: Socket.IO server for real-time updates
- **scheduler**: Background job scheduler
- **worker-short**: Short running background jobs
- **worker-long**: Long running background jobs
- **redis-cache**: Caching layer
- **redis-queue**: Job queue
- **redis-socketio**: WebSocket pub/sub
- **db**: MariaDB database

## Troubleshooting

### Site creation fails
```bash
# Check logs
docker-compose logs create-site

# Recreate site
docker-compose down
docker volume prune
docker-compose up -d
```

### CORS issues
```bash
# Update CORS settings
docker-compose exec backend bench --site erpnext.localhost set-config allow_cors "http://localhost:3000"
docker-compose restart
```

### Performance on Apple Silicon
```bash
# Ensure Docker Desktop settings:
# - Use virtualization framework: Apple Virtualization
# - Enable VirtioFS
# - Allocate sufficient resources (8GB+ RAM recommended)
```

## Production Deployment

### Security Checklist

- [ ] Change all default passwords
- [ ] Update CORS to specific domains
- [ ] Enable CSRF protection
- [ ] Use HTTPS with proper certificates
- [ ] Implement rate limiting
- [ ] Regular backups
- [ ] Monitor logs

### Environment-specific Configuration

1. Update `docker-compose.prod.yml` with production values
2. Use Docker secrets for sensitive data
3. Set up reverse proxy (Nginx/Traefik) with SSL
4. Configure backup strategy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Frappe Framework](https://frappeframework.com/)
- [ERPNext](https://erpnext.com/)
- [Docker](https://www.docker.com/)

## Support

For issues and questions:
- Create an issue in this repository
- Check [ERPNext Forum](https://discuss.erpnext.com/)
- Review [Frappe Docker documentation](https://github.com/frappe/frappe_docker)