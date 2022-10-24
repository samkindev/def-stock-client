import React, { createContext, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Feedback } from './Components';
import MainRoutes from './app/Navigations/MainRoutes';

// Context creation
export const FeedbackContext = createContext({});
export const SocketContext = createContext();

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
			<FeedbackContext.Provider value={FEEDBACKCONTEXTVALUE}>
				<Routes>
					<Route
						path="*"
						element={<MainRoutes />}
					/>
				</Routes>
				<Feedback />
			</FeedbackContext.Provider>
	)
}