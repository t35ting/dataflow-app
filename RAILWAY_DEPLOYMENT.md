# Railway Environment Variables Configuration

## Required Environment Variables

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (Railway will provide this automatically when you add a PostgreSQL service)

### Optional Environment Variables
- `NODE_ENV` - Set to "production" for production deployments (Railway sets this automatically)
- `PORT` - Port number (Railway sets this automatically, defaults to 5000)

## Setting Up Environment Variables

### Method 1: Using Railway CLI
```bash
# Set database URL (Railway will provide this when you add PostgreSQL service)
railway variables set DATABASE_URL="your-postgresql-connection-string"

# Set NODE_ENV to production
railway variables set NODE_ENV="production"
```

### Method 2: Using Railway Dashboard
1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Add the required environment variables

## Database Setup

### Adding PostgreSQL Service
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically:
   - Create a PostgreSQL database
   - Set the `DATABASE_URL` environment variable
   - Link it to your application

### Running Database Migrations
After adding the PostgreSQL service, run:
```bash
railway run npm run db:push
```

This will create the necessary tables using Drizzle ORM.

## Deployment Checklist

- [ ] Railway CLI installed (`npm install -g @railway/cli`)
- [ ] Logged in to Railway (`railway login`)
- [ ] Project linked to Railway (`railway link`)
- [ ] PostgreSQL service added to project
- [ ] Environment variables configured
- [ ] Database migrations run (`railway run npm run db:push`)
- [ ] Application deployed (`railway up`)

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure build command works locally (`npm run build`)

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is set correctly
   - Check that PostgreSQL service is running
   - Run database migrations

3. **Environment Variable Issues**
   - Use `railway variables` to check current variables
   - Ensure all required variables are set

4. **Port Issues**
   - Railway automatically sets the `PORT` environment variable
   - Your app should use `process.env.PORT || 5000`

### Useful Commands

```bash
# View logs
railway logs

# Check status
railway status

# Open app in browser
railway open

# Run commands in Railway environment
railway run npm run db:push

# View environment variables
railway variables

# Set environment variables
railway variables set KEY=value
```
