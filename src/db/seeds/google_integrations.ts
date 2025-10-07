import { db } from '@/db';
import { googleIntegrations } from '@/db/schema';

async function main() {
    const sampleGoogleIntegrations = [
        {
            userId: 'test-user-1',
            accessToken: 'ya29.a0AfH6SMCxKjP9YzH2mR8vN5tQ1wE6sL3kF7dM9xC2vB4nA8uW6yT5rE3wQ1sD',
            refreshToken: '1//04TxK9dF2eRoGCgYIARAAGAQSNwF-L9IrJ8mH3kL7dF9vR2xQ5nB8wE6tY4uI',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'test-user-2',
            accessToken: 'ya29.a0AfH6SMDyLmN8ZwJ4oR6vP7sT2xF8dL5kG9eN1yD4vC6oB9vX8zU7rF5yR3tE',
            refreshToken: '1//04YzL7eG4fSpHCgYIARAAGAQSNwF-L9IrK9nI5lM9dG8wS4yR7oC8xF8uZ6vJ',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(googleIntegrations).values(sampleGoogleIntegrations);
    
    console.log('✅ Google integrations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});