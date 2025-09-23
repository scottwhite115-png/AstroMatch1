# Supabase Integration Rules

## 🔧 Setup Rules
- **Environment Variables**: Use proper env var naming
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Client Initialization**: Initialize client once and reuse
- **Error Handling**: Handle Supabase errors gracefully

## 🔐 Authentication Rules
- **OAuth Providers**: Support Google, Facebook, Apple
- **Email Magic Links**: Implement email authentication
- **Session Management**: Handle user sessions properly
- **User Profiles**: Create user profiles on first login

## 🗄️ Database Rules
- **Row Level Security**: Enable RLS on all tables
- **Policies**: Write secure RLS policies
- **Migrations**: Use Supabase migrations for schema changes
- **Backups**: Regular database backups

## 📊 Real-time Rules
- **Subscriptions**: Use Supabase real-time for chat
- **Event Handling**: Handle real-time events properly
- **Connection Management**: Manage WebSocket connections
- **Error Recovery**: Handle connection failures

## 🔒 Security Rules
- **RLS Policies**: Secure all data access
- **API Keys**: Never expose service role keys
- **User Data**: Protect user privacy
- **Audit Logs**: Log important user actions

## 📱 Client Rules
- **Type Safety**: Use generated TypeScript types
- **Error Handling**: Handle all Supabase errors
- **Loading States**: Show loading indicators
- **Offline Support**: Handle offline scenarios

## 🚀 Performance Rules
- **Query Optimization**: Optimize database queries
- **Caching**: Use appropriate caching strategies
- **Connection Pooling**: Manage connections efficiently
- **Monitoring**: Monitor Supabase usage and performance

## 📋 Best Practices
- **Type Generation**: Use `supabase gen types typescript`
- **Local Development**: Use Supabase CLI for local development
- **Testing**: Test Supabase integration thoroughly
- **Documentation**: Document all Supabase usage
