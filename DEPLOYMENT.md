# Stock Monitor Deployment Guide

This guide will help you deploy the Stock Market Monitor application on your own server. The application is a full-stack application built with React, TypeScript, and Express.js.

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- A server with a public IP address (Linux server recommended)
- Basic knowledge of server administration
- (Optional) Domain name for your application

## Deployment Options

There are several ways to deploy this application:

1. Direct server deployment
2. Docker deployment
3. Cloud platform deployment (Heroku, AWS, DigitalOcean, etc.)

This guide will focus on direct server deployment, which is the simplest approach.

## Step 1: Prepare Your Server

First, ensure your server has the necessary software installed:

```bash
# Update package lists
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install development tools (needed for building the application)
sudo apt install -y build-essential

# Verify installations
node -v
npm -v
```

## Step 2: Set Up the Application

1. Clone or upload the project to your server:

```bash
# If you want to clone from a Git repository
git clone <your-repository-url> /path/to/stock-monitor

# Or upload the project files directly to your server using SCP or SFTP
```

2. Navigate to the project directory:

```bash
cd /path/to/stock-monitor
```

3. Install dependencies:

```bash
npm install
```

## Step 3: Build the Application

The application needs to be built before it can be deployed:

```bash
# Create a production build
npm run build
```

This will create optimized production-ready files in the `dist` directory.

## Step 4: Run the Application

You can now run the application:

```bash
# Start the application in production mode
NODE_ENV=production npm run start
```

By default, the application will run on port 5000. You can access it at `http://your-server-ip:5000`.

## Step 5: Keep the Application Running (Production Environment)

For a production environment, you'll want to keep the application running even after you log out or if it crashes. You can use a process manager like PM2:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application with PM2
pm2 start npm --name "stock-monitor" -- run start

# Set PM2 to automatically start on server reboot
pm2 startup
pm2 save
```

## Step 6: Set Up a Reverse Proxy (Optional but Recommended)

For better security and performance, you should set up a reverse proxy with Nginx or Apache:

### Nginx Example:

1. Install Nginx:

```bash
sudo apt install -y nginx
```

2. Create a configuration file for your application:

```bash
sudo nano /etc/nginx/sites-available/stock-monitor
```

3. Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com; # Or your server IP if you don't have a domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/stock-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Set Up SSL/TLS (HTTPS) (Optional but Highly Recommended)

For secure connections, set up SSL/TLS with Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Follow the prompts to set up SSL/TLS.

## Step 8: Set Up Firewall (Optional but Recommended)

Configure a firewall to improve security:

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

## Troubleshooting

If you encounter issues with the deployment, check the following:

1. Application logs:
   ```bash
   pm2 logs stock-monitor
   ```

2. Nginx logs (if using Nginx):
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Ensure your server's firewall allows traffic on the necessary ports.

4. Verify that the API source is accessible from your server.

## API Access Considerations

The application connects to the stock data API at https://api-ticks.rvinod.com/stream. If there are any network restrictions or if this API requires special access from your server, you may need to:

1. Contact the API provider for whitelist access
2. Set up proper API key authentication if required
3. Update the API URL in the code if the endpoint changes

The API connection is configured in: `server/routes.ts`.

## Environment Variables

You may need to set up the following environment variables for a production environment:

- `NODE_ENV=production`
- `PORT=5000` (or your preferred port)

You can set these variables before starting the application or in a `.env` file.

## Updating the Application

To update the application:

1. Pull the latest changes (if using Git):
   ```bash
   git pull
   ```

2. Install dependencies (if they've changed):
   ```bash
   npm install
   ```

3. Rebuild the application:
   ```bash
   npm run build
   ```

4. Restart the application:
   ```bash
   pm2 restart stock-monitor
   ```

## Conclusion

Your Stock Market Monitor application should now be deployed and accessible. If you need any further assistance, please refer to the documentation for the specific tools you're using, or contact the application maintainer.