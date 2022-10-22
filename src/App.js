import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import Login from './modules/Auth';
import { ForbiddenPage, ProtectedPage, Chargement, Feedback } from './Components';
import { getConnectedUser } from './app/reducers/auth';
import MainRoutes from './app/Navigations/MainRoutes';

// Context creation
export const FeedbackContext = createContext({});
export const SocketContext = createContext();
const socket = socketIOClient('http://localhost:8082');

export default function App() {
	// Feedback context value
	const [openState, setOpenState] = useState(false);
	const [messageState, setMessageState] = useState("");
	const [typeState, setTypeState] = useState();
	const [idState, setIdState] = useState("global-feed-back");
	const FEEDBACKCONTEXTVALUE = {
		onClose: () => {
			setOpenState(false);
			setMessageState("");
		},
		createFeedback: (message, id, type) => {
			setOpenState(true);
			setMessageState(message);
			setIdState(id);
			setTypeState(type);
		},
		getFeedback: () => {
			return {
				messageState,
				openState,
				idState,
				typeState,
			};
		},
	};

	return (
		<SocketContext.Provider value={socket}>
			<FeedbackContext.Provider value={FEEDBACKCONTEXTVALUE}>
				<Routes>
					<Route
						path="*"
						element={<MainRoutes />}
					/>
				</Routes>
				<Feedback />
			</FeedbackContext.Provider>
		</SocketContext.Provider>
	)
}