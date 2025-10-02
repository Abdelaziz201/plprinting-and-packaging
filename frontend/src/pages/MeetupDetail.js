import React from 'react';
import { useParams } from 'react-router-dom';

const MeetupDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Meetup Detail</h1>
        <p className="text-gray-600">Meetup ID: {id}</p>
        <p className="text-sm text-gray-500 mt-4">This page is under development.</p>
      </div>
    </div>
  );
};

export default MeetupDetail;
