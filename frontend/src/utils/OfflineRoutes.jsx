import React from 'react';
import { Route } from 'react-router-dom';
import Downloads from '../pages/offlinePages/Downloads.jsx';
import FlashcardSet from '../pages/offlinePages/FlashcardSet.jsx';
import FlashcardPage from '../pages/offlinePages/FlashcardPage.jsx';
import Test from '../pages/offlinePages/Test.jsx';
import Learn from '../pages/offlinePages/Learn.jsx';
import User from '../pages/offlinePages/User.jsx';
import Search from '../pages/offlinePages/Search.jsx';
import Create from '../pages/offlinePages/Create.jsx';
import Edit from '../pages/offlinePages/Edit.jsx';

export const OfflineRoutes = (
        <>
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/downloads/set/:id" element={<FlashcardSet />} />
            <Route path="/downloads/set/:id/flashcard" element={<FlashcardPage />} />
            <Route path="/downloads/test/:id" element={<Test />} />
            <Route path="/downloads/learn/:flashcardSetId" element={<Learn />} />
            <Route path="/downloads/user/:userId" element={<User />} />
            <Route path="/downloads/search/:searchTerm" element={<Search />} />
            <Route path="/downloads/create" element={<Create />} />
            <Route path="/downloads/edit/:id" element={<Edit />} />
        </>
);