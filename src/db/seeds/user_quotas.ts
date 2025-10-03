import { db } from '@/db';
import { userQuotas } from '@/db/schema';

async function main() {
    const sampleUserQuotas = [
        {
            userId: 'test-user-1',
            monthlyQuota: 50,
            remainingCredits: 35,
            monthlyCredits: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'test-user-2',
            monthlyQuota: 100,
            remainingCredits: 75,
            monthlyCredits: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(userQuotas).values(sampleUserQuotas);
    
    console.log('✅ User quotas seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});