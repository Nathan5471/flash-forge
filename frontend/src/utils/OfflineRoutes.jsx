import React from 'react';
import { Route } from 'react-router-dom';
import Downloads from '../pages/offlinePages/Downloads.jsx';
import FlashcardSet from '../pages/offlinePages/FlashcardSet.jsx';
import Test from '../pages/offlinePages/Test.jsx';

export const OfflineRoutes = (
        <>
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/downloads/set/:id" element={<FlashcardSet />} />
            <Route path="/downloads/test/:id" element={<Test />} />
        </>
);