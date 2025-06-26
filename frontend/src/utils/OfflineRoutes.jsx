import React from 'react';
import { Route } from 'react-router-dom';
import Downloads from '../pages/offlinePages/Downloads.jsx';
import FlashcardSet from '../pages/FlashcardSet.jsx';
import FlashcardPage from '../pages/FlashcardPage.jsx';
import Test from '../pages/Test.jsx';
import Learn from '../pages/Learn.jsx';
import User from '../pages/User.jsx';
import Search from '../pages/Search.jsx';
import Create from '../pages/Create.jsx';
import Edit from '../pages/Edit.jsx';

export const OfflineRoutes = (
        <>
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/downloads/set/:id" element={<FlashcardSet isOffline={true} />} />
            <Route path="/downloads/set/:id/flashcard" element={<FlashcardPage isOffline={true} />} />
            <Route path="/downloads/test/:id" element={<Test isOffline={true} />} />
            <Route path="/downloads/learn/:flashcardSetId" element={<Learn isOffline={true} />} />
            <Route path="/downloads/user/:userId" element={<User isOffline={true} />} />
            <Route path="/downloads/search/:searchTerm" element={<Search isOffline={true} />} />
            <Route path="/downloads/create" element={<Create isOffline={true}/>} />
            <Route path="/downloads/edit/:id" element={<Edit isOffline={true}/>} />
        </>
);