# Trevor Kavanaugh API

Backend API for trevorkavanaugh.com analytics and future features.

## Deployment

**Host:** DigitalOcean Droplet
**URL:** https://api.trevorkavanaugh.com
**Port:** 3000 (behind nginx reverse proxy)
**Process Manager:** PM2

## Setup

```bash
npm install
pm2 start index.js --name "trevorkavanaugh-api"
pm2 save
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/track` | Track analytics events |
| GET | `/api/stats` | View analytics stats |
| GET | `/api/comments/:slug` | Get approved comments |
| POST | `/api/comments` | Submit comment (requires moderation) |

## Deployment Script

To deploy updates from this repo to the droplet:

```bash
ssh naughtymoddy@64.23.250.139 "cd ~/trevorkavanaugh-api && git pull origin main && pm2 restart trevorkavanaugh-api"
```

Or use the deploy script:

```bash
./api/deploy.sh
```

## Security

- CORS restricted to trevorkavanaugh.com
- Rate limiting (50 requests/15min for tracking)
- Suspicious request flagging
- Event type whitelist
- Input sanitization
