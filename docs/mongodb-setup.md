# MongoDB Setup

## Database Information

Database Name: fridgerescue

Database Technology: MongoDB Atlas

ODM: Mongoose

## Required Environment Variable

MONGO_URI

## Install Dependencies

```bash
npm install mongoose dotenv
```

## Connection Module

Location:

server/config/db.js

## Testing Connection

Run:

```bash
node tests/testConnection.js
```

Expected Output:

```text
MongoDB Connected
```

## Security Notes

- Never commit .env files
- Never commit passwords
- Use .env.example for placeholder values
- Store credentials in MongoDB Atlas
