# Google OAuth Setup Guide - TradeFlow AI

This guide explains how to set up Google OAuth for Gmail and Google Sheets integration in your TradeFlow AI application.

## Prerequisites

- Active Google Cloud Project
- Supabase project configured (already done ✅)
- Next.js app running locally or deployed

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Enable Required APIs

1. Navigate to **APIs & Services** → **Library**
2. Search and enable the following APIs:
   - **Gmail API**
   - **Google Sheets API**
   - **Google+ API** (for OAuth)

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (or Internal if using Google Workspace)
3. Fill in the required fields:
   - **App name**: TradeFlow AI
   - **User support email**: Your email
   - **Developer contact**: Your email
4. **Scopes**: Add the following scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/spreadsheets`
5. Add test users (your email address) if in testing mode
6. Save and continue

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: TradeFlow AI Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback
     ```
5. Click **Create**
6. Copy your **Client ID** and **Client Secret**

## Step 5: Update Environment Variables

Add the following to your `.env.local` file:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Never commit your `.env.local` file to version control!

## Step 6: Update Supabase Database

Run the SQL migration file to create required tables:

```bash
# Execute the supabase-oauth-po-history.sql file in your Supabase SQL Editor
```

The migration creates:
- `google_integrations` table - stores OAuth tokens
- `po_history` table - stores PO records with real-time subscriptions

## Step 7: Enable Supabase Realtime

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Replication**
3. Enable replication for the `po_history` table

## Testing the OAuth Flow

### 1. Start Development Server

```bash
npm run dev
# or
bun dev
```

### 2. Test Login/Signup

1. Go to `http://localhost:3000/signup`
2. Create a new account using the Supabase Auth UI
3. Check your email for confirmation (if email confirmation is enabled)
4. Login at `http://localhost:3000/login`

### 3. Test Google OAuth

1. Navigate to `/dashboard` after logging in
2. Click the **"Connect Google"** button in Quick Actions
3. You should be redirected to Google's consent screen
4. Grant permissions for Gmail and Sheets
5. You'll be redirected back to the dashboard
6. Verify the success message appears
7. The Connect Google button should now show "Google Connected" with a green checkmark

### 4. Verify Token Storage

Check that tokens are stored in Supabase:

```sql
SELECT user_id, is_active, created_at, updated_at 
FROM google_integrations 
WHERE user_id = 'your-user-id';
```

### 5. Test Real-time PO History

#### Manual Insert Test:
```sql
INSERT INTO po_history (user_id, po_number, description, amount)
VALUES (
  'your-user-id',
  'PO-TEST-001',
  'Test Purchase Order',
  50000.00
);
```

The new PO should appear in your dashboard **instantly without page refresh**!

#### Update Test:
```sql
UPDATE po_history 
SET amount = 75000.00 
WHERE po_number = 'PO-TEST-001';
```

The amount should update in real-time on the dashboard.

#### Delete Test:
```sql
DELETE FROM po_history 
WHERE po_number = 'PO-TEST-001';
```

The PO should disappear from the dashboard immediately.

## Troubleshooting

### OAuth Redirect URI Mismatch
**Error**: `redirect_uri_mismatch`

**Solution**: Ensure your redirect URI in Google Cloud Console exactly matches:
```
http://localhost:3000/api/auth/google/callback
```

### No Refresh Token Received
**Error**: `refresh_token is null`

**Solution**: 
- Revoke access at https://myaccount.google.com/permissions
- Try connecting again - first authorization always returns refresh token
- Check that `access_type: 'offline'` and `prompt: 'consent'` are set in the OAuth flow

### Real-time Updates Not Working
**Error**: PO history doesn't update in real-time

**Solution**:
1. Check Supabase Realtime is enabled for `po_history` table
2. Verify the publication includes the table:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.po_history;
   ```
3. Check browser console for subscription errors

### Token Expiry Issues
**Issue**: Access token expires after 1 hour

**Solution**: Implement token refresh logic (future enhancement):
```typescript
// In a future update, add refresh token logic:
if (tokenExpired) {
  const newTokens = await refreshGoogleToken(refreshToken)
  // Update database with new access_token
}
```

## Security Best Practices

1. **Never expose credentials**: Keep `.env.local` in `.gitignore`
2. **Use HTTPS in production**: Update `NEXT_PUBLIC_APP_URL` to HTTPS
3. **Rotate secrets regularly**: Regenerate OAuth credentials periodically
4. **Validate tokens server-side**: Always verify tokens on the backend
5. **Limit token scopes**: Only request necessary permissions
6. **Store tokens securely**: Use Supabase Row Level Security (RLS) policies

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your production domain)
   - All Supabase credentials (already set ✅)

2. Update Google Cloud Console:
   - Add production domain to Authorized JavaScript origins
   - Add production callback URL to Authorized redirect URIs

3. Enable Supabase Realtime in production database

## API Usage Examples

### Send Email via Gmail (After OAuth)

```typescript
import { google } from 'googleapis'

const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

const message = {
  userId: 'me',
  requestBody: {
    raw: Buffer.from(
      `To: recipient@example.com\r\n` +
      `Subject: PO Notification\r\n\r\n` +
      `Your PO has been processed.`
    ).toString('base64')
  }
}

await gmail.users.messages.send(message)
```

### Write to Google Sheets

```typescript
import { google } from 'googleapis'

const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

await sheets.spreadsheets.values.append({
  spreadsheetId: 'your-sheet-id',
  range: 'Sheet1!A1',
  valueInputOption: 'RAW',
  requestBody: {
    values: [
      ['PO-2024-001', 'Vendor Name', 50000, new Date().toISOString()]
    ]
  }
})
```

## Next Steps

1. ✅ OAuth flow implemented
2. ✅ Real-time subscriptions working
3. 🔄 Implement Gmail send functionality
4. 🔄 Implement Sheets export functionality
5. 🔄 Add token refresh logic
6. 🔄 Add integration status dashboard

## Support

For issues or questions:
- Check [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- Review [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- Contact support@tradeflow.ai