import { db } from '../index';
import { clients } from '../schema';

async function main() {
    const sampleClients = [
        {
            clientId: 'CLIENT_001',
            userId: 'test-user-1',
            name: 'John Smith',
            company: 'Acme Corporation',
            email: 'john.smith@acmecorp.com',
            phone: '(555) 123-4567',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            clientId: 'CLIENT_002',
            userId: 'test-user-1',
            name: 'Sarah Johnson',
            company: 'TechStart Solutions',
            email: 'sarah.johnson@techstartsolutions.com',
            phone: '555.987.6543',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            clientId: 'CLIENT_003',
            userId: 'test-user-1',
            name: 'Michael Chen',
            company: 'Global Industries Inc',
            email: 'michael.chen@globalindustries.com',
            phone: '+1-555-456-7890',
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            clientId: 'CLIENT_004',
            userId: 'test-user-1',
            name: 'Lisa Rodriguez',
            company: 'Innovative Designs LLC',
            email: 'lisa.rodriguez@innovativedesigns.com',
            phone: '(555) 234-5678',
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            clientId: 'CLIENT_005',
            userId: 'test-user-1',
            name: 'David Thompson',
            company: 'Metro Construction Group',
            email: 'david.thompson@metroconstruction.com',
            phone: '555-789-0123',
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        }
    ];

    await db.insert(clients).values(sampleClients);
    
    console.log('✅ Clients seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});