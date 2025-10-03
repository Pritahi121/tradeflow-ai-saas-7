import { db } from '@/db';
import { poHistory } from '@/db/schema';

async function main() {
    const samplePoHistory = [
        {
            userId: 'test-user-1',
            poNumber: 'PO-2024-001',
            description: 'Office supplies - printer paper, pens, and notebooks',
            amount: 247.85,
            status: 'completed',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: 'test-user-2',
            poNumber: 'PO-2024-015',
            description: 'Computer equipment - Dell laptops for development team',
            amount: 4250.00,
            status: 'completed',
            createdAt: new Date('2024-02-02').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            userId: 'test-user-1',
            poNumber: 'INV-24-078',
            description: 'Marketing materials - brochures and business cards',
            amount: 680.50,
            status: 'pending',
            createdAt: new Date('2024-02-20').toISOString(),
            updatedAt: new Date('2024-02-20').toISOString(),
        },
        {
            userId: 'test-user-2',
            poNumber: 'PO-2024-032',
            description: 'Consulting services - IT security audit',
            amount: 5500.00,
            status: 'completed',
            createdAt: new Date('2024-03-01').toISOString(),
            updatedAt: new Date('2024-03-15').toISOString(),
        },
        {
            userId: 'test-user-1',
            poNumber: 'PO-2024-045',
            description: 'Software licenses - Adobe Creative Suite annual subscription',
            amount: 1299.99,
            status: 'pending',
            createdAt: new Date('2024-03-10').toISOString(),
            updatedAt: new Date('2024-03-12').toISOString(),
        },
        {
            userId: 'test-user-2',
            poNumber: 'INV-24-112',
            description: 'Office furniture - ergonomic chairs for meeting room',
            amount: 850.75,
            status: 'cancelled',
            createdAt: new Date('2024-03-22').toISOString(),
            updatedAt: new Date('2024-03-25').toISOString(),
        },
        {
            userId: 'test-user-1',
            poNumber: 'PO-2024-058',
            description: 'Catering services for company quarterly meeting',
            amount: 320.00,
            status: 'completed',
            createdAt: new Date('2024-04-05').toISOString(),
            updatedAt: new Date('2024-04-05').toISOString(),
        },
        {
            userId: 'test-user-2',
            poNumber: 'PO-2024-067',
            description: 'Travel expenses - conference attendance and accommodation',
            amount: 1850.30,
            status: 'pending',
            createdAt: new Date('2024-04-18').toISOString(),
            updatedAt: new Date('2024-04-20').toISOString(),
        }
    ];

    await db.insert(poHistory).values(samplePoHistory);
    
    console.log('✅ PO History seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});