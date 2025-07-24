import { sql } from '@vercel/postgres';

export async function createStatusTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS statuses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name VARCHAR(255) NOT NULL,
        status_content TEXT NOT NULL,
        status_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table "statuses" created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}
