# Deployment Guide - Missing Persons Database System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Kenya-Specific Integrations](#kenya-specific-integrations)
7. [Security Considerations](#security-considerations)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Version 13 or higher
- **Redis**: Version 6.0 or higher
- **Python**: Version 3.9+ (for AI/ML features)
- **Docker** (optional, for containerized deployment)

### Kenya-Specific Requirements
- Kenya Police Service API access
- DCI (Directorate of Criminal Investigations) integration credentials
- M-Pesa API credentials (for transaction tracking)
- Kenya Red Cross API access
- Google Maps API key (Kenya-focused)

## Local Development Setup

### Quick Start
```bash
# Clone and setup
git clone <repository-url>
cd missing-persons-system

# Run the setup script
./setup.sh

# Start PostgreSQL and Redis
sudo systemctl start postgresql
sudo systemctl start redis

# Run database migrations
cd backend
npm run migrate
npm run seed  # Optional: seed with sample data

# Start the backend
npm run dev

# In another terminal, start the frontend
cd ../frontend
npm start
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # Mobile (if developing mobile app)
   cd ../mobile
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env` in each directory
   - Update with your actual configuration values

3. **Database Setup**
   ```bash
   # Create database
   createdb missing_persons_db
   
   # Run migrations
   cd backend
   npm run migrate
   ```

## Production Deployment

### Option 1: Traditional Server Deployment

#### Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- 4GB RAM minimum (8GB recommended)
- 50GB storage (for media files)
- SSL certificate

#### Deployment Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install Redis
   sudo apt install redis-server
   
   # Install Nginx
   sudo apt install nginx
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone <repository-url> /var/www/missing-persons
   cd /var/www/missing-persons
   
   # Install dependencies
   cd backend && npm ci --production
   cd ../frontend && npm ci && npm run build
   
   # Setup environment
   cp backend/.env.example backend/.env
   # Edit .env with production values
   
   # Setup database
   sudo -u postgres createuser missing_persons
   sudo -u postgres createdb missing_persons_db -O missing_persons
   npm run migrate
   ```

3. **Process Management**
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'missing-persons-api',
       script: './backend/src/server.js',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       },
       instances: 'max',
       exec_mode: 'cluster'
     }]
   }
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/missing-persons
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       # Frontend
       location / {
           root /var/www/missing-persons/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       # API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # WebSocket for real-time features
       location /socket.io {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Option 2: Docker Deployment

1. **Docker Compose Setup**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   
   services:
     postgres:
       image: postgres:13
       environment:
         POSTGRES_DB: missing_persons_db
         POSTGRES_USER: missing_persons
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
     
     redis:
       image: redis:6-alpine
       ports:
         - "6379:6379"
     
     backend:
       build: ./backend
       environment:
         - NODE_ENV=production
         - DB_HOST=postgres
         - REDIS_HOST=redis
       ports:
         - "5000:5000"
       depends_on:
         - postgres
         - redis
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   
   volumes:
     postgres_data:
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

## Environment Configuration

### Backend Environment Variables

```bash
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=missing_persons
DB_PASSWORD=secure_password
DB_NAME=missing_persons_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Security
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
SESSION_SECRET=your_session_secret

# Email (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=alerts@missingpersons.ke
EMAIL_PASSWORD=app_password
EMAIL_FROM=Kenya Missing Persons <noreply@missingpersons.ke>

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+254700000000

# Kenya Integrations
KENYA_POLICE_API_KEY=your_police_api_key
DCI_API_ENDPOINT=https://api.dci.go.ke
DCI_API_KEY=your_dci_api_key
KENYA_RED_CROSS_API_KEY=your_red_cross_key

# M-Pesa
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=your_shortcode

# Maps and Location
GOOGLE_MAPS_API_KEY=your_google_maps_key

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Setup

### PostgreSQL Configuration

1. **Create Database and User**
   ```sql
   CREATE USER missing_persons WITH PASSWORD 'secure_password';
   CREATE DATABASE missing_persons_db OWNER missing_persons;
   GRANT ALL PRIVILEGES ON DATABASE missing_persons_db TO missing_persons;
   ```

2. **Run Migrations**
   ```bash
   cd backend
   npm run migrate
   ```

3. **Backup Strategy**
   ```bash
   # Daily backup script
   #!/bin/bash
   BACKUP_DIR="/var/backups/missing-persons"
   DATE=$(date +%Y%m%d_%H%M%S)
   pg_dump missing_persons_db > "$BACKUP_DIR/backup_$DATE.sql"
   
   # Keep only last 30 days
   find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
   ```

## Kenya-Specific Integrations

### 1. Kenya Police Service Integration

```javascript
// Integration example
const policeIntegration = {
  submitReport: async (reportData) => {
    const response = await axios.post(
      process.env.KENYA_POLICE_API_ENDPOINT,
      {
        case_type: 'missing_person',
        details: reportData,
        reporting_station: reportData.police_station
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.KENYA_POLICE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
};
```

### 2. DCI Integration

```javascript
// DCI case submission
const dciIntegration = {
  createCase: async (missingPersonData) => {
    return await axios.post(
      `${process.env.DCI_API_ENDPOINT}/cases`,
      {
        type: 'MISSING_PERSON',
        priority: missingPersonData.priority,
        details: missingPersonData
      },
      {
        headers: {
          'X-API-Key': process.env.DCI_API_KEY
        }
      }
    );
  }
};
```

### 3. M-Pesa Integration (for tracking transactions)

```javascript
// M-Pesa transaction tracking
const mpesaIntegration = {
  trackTransactions: async (phoneNumber, dateRange) => {
    // Integration with M-Pesa API to track last known transactions
    // This requires proper authorization from Safaricom
  }
};
```

## Security Considerations

### 1. Data Protection
- Implement encryption at rest for sensitive data
- Use HTTPS for all communications
- Regular security audits

### 2. Access Control
- Role-based permissions (Admin, Police, DCI, NGO, Citizen)
- Multi-factor authentication for sensitive roles
- API rate limiting

### 3. Privacy Compliance
- GDPR compliance for international users
- Kenya Data Protection Act compliance
- Data anonymization options
- Right to be forgotten implementation

### 4. Audit Trail
- Log all data access and modifications
- Track user activities
- Maintain case history

## Monitoring and Maintenance

### 1. Application Monitoring

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // Check DB connection
    redis: 'connected'     // Check Redis connection
  });
});
```

### 2. Log Management

```bash
# Logrotate configuration
# /etc/logrotate.d/missing-persons
/var/www/missing-persons/backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    postrotate
        pm2 reload missing-persons-api
    endscript
}
```

### 3. Performance Monitoring

- Set up monitoring with tools like:
  - PM2 Monitoring
  - New Relic
  - Sentry for error tracking
  - PostgreSQL monitoring

### 4. Backup and Recovery

```bash
# Complete backup script
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/missing-persons/$BACKUP_DATE"

mkdir -p $BACKUP_DIR

# Database backup
pg_dump missing_persons_db > "$BACKUP_DIR/database.sql"

# Files backup
tar -czf "$BACKUP_DIR/uploads.tar.gz" /var/www/missing-persons/backend/uploads/

# Configuration backup
cp /var/www/missing-persons/backend/.env "$BACKUP_DIR/"

echo "Backup completed: $BACKUP_DIR"
```

## Mobile App Deployment

### Android

1. **Build APK**
   ```bash
   cd mobile
   npx react-native build-android --mode=release
   ```

2. **Google Play Store**
   - Create developer account
   - Upload APK
   - Configure app listing

### iOS

1. **Build IPA**
   ```bash
   cd mobile
   npx react-native build-ios --mode=release
   ```

2. **App Store**
   - Use Xcode to build and upload
   - Submit for review

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check database connectivity
   psql -h localhost -U missing_persons -d missing_persons_db
   ```

2. **Redis Connection Issues**
   ```bash
   # Check Redis status
   sudo systemctl status redis
   
   # Test Redis connection
   redis-cli ping
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R www-data:www-data /var/www/missing-persons
   sudo chmod -R 755 /var/www/missing-persons
   ```

4. **PM2 Issues**
   ```bash
   # Check PM2 status
   pm2 status
   
   # View logs
   pm2 logs missing-persons-api
   
   # Restart application
   pm2 restart missing-persons-api
   ```

## Support and Documentation

- **API Documentation**: Available at `/api/docs` when running
- **User Manual**: See `docs/USER_MANUAL.md`
- **Developer Guide**: See `docs/DEVELOPER_GUIDE.md`
- **Troubleshooting**: See `docs/TROUBLESHOOTING.md`

For technical support, contact the development team or create an issue in the repository.

