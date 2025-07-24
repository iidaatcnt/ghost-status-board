import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { author_name, status_content, status_type } = await request.json();

    // 既存のステータスを検索し、あれば更新、なければ新規作成
    const existingStatus = await sql`
      SELECT * FROM statuses WHERE author_name = ${author_name};
    `;

    if (existingStatus.rows.length > 0) {
      // 更新
      await sql`
        UPDATE statuses
        SET status_content = ${status_content},
            status_type = ${status_type},
            updated_at = CURRENT_TIMESTAMP
        WHERE author_name = ${author_name};
      `;
      return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });
    } else {
      // 新規作成
      await sql`
        INSERT INTO statuses (author_name, status_content, status_type)
        VALUES (${author_name}, ${status_content}, ${status_type});
      `;
      return NextResponse.json({ message: 'Status created successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error handling status POST request:', error);
    return NextResponse.json({ error: 'Failed to handle status' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM statuses ORDER BY updated_at DESC;`;
    return NextResponse.json({ statuses: rows }, { status: 200 });
  } catch (error) {
    console.error('Error handling status GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM statuses WHERE id = ${id};`;
    return NextResponse.json({ message: 'Status deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling status DELETE request:', error);
    return NextResponse.json({ error: 'Failed to delete status' }, { status: 500 });
  }
}
