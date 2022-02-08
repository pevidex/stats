# Stats

Script to fetch posts from an endpoint and calculate statistics. Currently calculating the following:
- Average character length of posts per month
- Longest post by character length per month
- Total posts split by week number
- Average number of posts per user per month

## Install
```
npm install
```

## Run
Configure an .env in your source folder with the following pattern:
```
POSTS_PAGES="10"
CLIENT_ID="<clientId-token>"
EMAIL="<email>"
NAME="<name>"
API_URL="https://api.supermetrics.com"
JSON_PATH="<dest_path_stats>.json"
```

Run the script:
```
npm run start
```

## Test
```
npm test
```
