import React from 'react';
import { Route } from 'react-router-dom';
import Downloads from '../pages/offlinePages/Downloads.jsx';
import FlashcardSet from '../pages/offlinePages/FlashcardSet.jsx';
import FlashcardPage from '../pages/offlinePages/FlashcardPage.jsx';
import Test from '../pages/Test.jsx';
import Learn from '../pages/offlinePages/Learn.jsx';
import User from '../pages/User.jsx';
import Search from '../pages/offlinePages/Search.jsx';
import Create from '../pages/Create.jsx';
import Edit from '../pages/Edit.jsx';

export const OfflineRoutes = (
        <>
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/downloads/set/:id" element={<FlashcardSet />} />
            <Route path="/downloads/set/:id/flashcard" element={<FlashcardPage />} />
            <Route path="/downloads/test/:id" element={<Test isOffline={true} />} />
            <Route path="/downloads/learn/:flashcardSetId" element={<Learn />} />
            <Route path="/downloads/user/:userId" element={<User isOffline={true} />} />
            <Route path="/downloads/search/:searchTerm" element={<Search />} />
            <Route path="/downloads/create" element={<Create isOffline={true}/>} />
            <Route path="/downloads/edit/:id" element={<Edit isOffline={true}/>} />
        </>
);