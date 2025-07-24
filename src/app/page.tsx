'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Status {
  id: string;
  author_name: string;
  status_content: string;
  status_type: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [authorName, setAuthorName] = useState('');
  const [statusContent, setStatusContent] = useState('');
  const [statusType, setStatusType] = useState('message');
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    const res = await fetch('/api/status');
    const data = await res.json();
    setStatuses(data.statuses);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author_name: authorName, status_content: statusContent, status_type: statusType }),
    });

    if (res.ok) {
      setAuthorName('');
      setStatusContent('');
      fetchStatuses(); // ステータスを再取得して更新
    } else {
      alert('Failed to post status');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Ghost Status Board</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label htmlFor="authorName" className="block text-gray-700 text-sm font-bold mb-2">Your Name/Nickname:</label>
          <input
            type="text"
            id="authorName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="statusContent" className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
          <textarea
            id="statusContent"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            value={statusContent}
            onChange={(e) => setStatusContent(e.target.value)}
            maxLength={100}
            required
          ></textarea>
          <p className="text-right text-gray-600 text-xs">{statusContent.length}/100 characters</p>
        </div>

        <div className="mb-4">
          <label htmlFor="statusType" className="block text-gray-700 text-sm font-bold mb-2">Status Type:</label>
          <select
            id="statusType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={statusType}
            onChange={(e) => setStatusType(e.target.value)}
          >
            <option value="message">Freeform Message</option>
            <option value="available">対応可能 (Available)</option>
            <option value="busy">取り込み中 (Busy)</option>
            <option value="in_meeting">会議中 (In a meeting)</option>
            <option value="out_of_office">外出中 (Out of office)</option>
            <option value="on_break">休憩中 (On break)</option>
            <option value="working_remotely">リモートワーク中 (Working remotely)</option>
            <option value="sick_leave">体調不良 (Sick leave)</option>
            <option value="on_vacation">休暇中 (On vacation)</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Status
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status.id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold">{status.author_name}</p>
            <p className="text-gray-800">{status.status_content}</p>
            <p className="text-gray-500 text-sm">Last updated: {new Date(status.updated_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}