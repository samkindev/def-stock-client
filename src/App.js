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

	const [gettingUser, setGettingUser] = useState(true);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getConnectedUser())
			.finally(() => setGettingUser(false));
	}, [dispatch]);

	return (
		<SocketContext.Provider value={socket}>
			<FeedbackContext.Provider value={FEEDBACKCONTEXTVALUE}>
				{gettingUser ?
					<Chargement
						sx={{
							height: '100vh'
						}}
					/> :
					<Routes>
						<Route
							path="/login"
							element={<ForbiddenPage element={<Login />} />}
						/>
						<Route
							path="*"
							element={
								<ProtectedPage element={
									<MainRoutes />
								}
								/>
							}
						/>
					</Routes>
				}
				<Feedback />
			</FeedbackContext.Provider>
		</SocketContext.Provider>
	)
}


// import React, { useEffect, createContext, useState } from "react";
// import "./App.css";
// import { Routes, Route, Navigate } from "react-router-dom";
// import socketIOClient from 'socket.io-client';
// import { FacturePDF, Topbar, Feedback, ForbiddenPage, ProtectedPage } from "./Components";
// import NavigationFacturation from "./modules/Facturation/navigation";
// import NavigationStock from "./modules/Stock/navigation";
// import { getUserData, getreqState, getAuth } from "./app/reducers/assujetti";
// import { useDispatch, useSelector } from "react-redux";
// import { Chargement } from "./Components";
// import { getLoginRedirectUrl } from "./utilities/helpers";
// import Configuration from "./modules/Stock/pages/Configuration";
// import Login from "./modules/Auth";

// export const FeedbackContext = createContext({});
// export const SocketContext = createContext();
// const socket = socketIOClient('http://localhost:8082');

// function App() {
// 	const loading = useSelector(getreqState) === "loading";
// 	const isAuth = useSelector(getAuth);
// 	const dispatch = useDispatch();

// 	// Feedback context value
// 	const [openState, setOpenState] = useState(false);
// 	const [messageState, setMessageState] = useState("");
// 	const [typeState, setTypeState] = useState();
// 	const [idState, setIdState] = useState("global-feed-back");
// 	// const [socket, setSocket] = useState();

// 	// Creation de la valeur par defaut du context feedback
// 	const feedbackContextValue = {
// 		onClose: () => {
// 			setOpenState(false);
// 			setMessageState("");
// 		},
// 		createFeedback: (message, id, type) => {
// 			setOpenState(true);
// 			setMessageState(message);
// 			setIdState(id);
// 			setTypeState(type);
// 		},
// 		getFeedback: () => {
// 			return {
// 				messageState,
// 				openState,
// 				idState,
// 				typeState,
// 			};
// 		},
// 	};

// 	useEffect(() => {
// 		// Recuperation des données de l'utilisateur
// 		dispatch(getUserData()).then((res) => {
// 			const data = res.payload;
// 			// Verification si l'utilisateur est connecté.
// 			// Si oui il accède à l'application
// 			// Sinon il est redirigé vers le login
// 			console.log("data => ", data);
// 			if (!data || !data.connected) {
// 				const href = getLoginRedirectUrl();
// 				window.location.href = href;
// 				// Création du socket
// 				// setSocket(socket);
// 			}
// 		});
// 	}, [dispatch]);

// 	return (
// 		<>
// 			<SocketContext.Provider value={socket}>
// 				<FeedbackContext.Provider value={feedbackContextValue}>
// 					<div>
// 						<Topbar />
// 						<Routes>
// 							<Route path="/login" element={
// 								<ForbiddenPage element={<Login />} redirectPath="/" />
// 							} />
// 							<Route path="/stock/configurations" element={
// 								<ProtectedPage element={<Configuration />} />
// 							} />
// 							<Route
// 								path="/stock/*"
// 								element={
// 									<ProtectedPage element={<NavigationStock />} />
// 								}
// 							/>
// 							<Route
// 								path="/facturation/*"
// 								element={
// 									<ProtectedPage element={<NavigationFacturation />} />
// 								}
// 							/>
// 							<Route
// 								path="/facture/:numFacture"
// 								element={
// 									<ProtectedPage element={<FacturePDF />} />
// 								}
// 							/>
// 							<Route
// 								path="*"
// 								element={<Navigate to="/stock" />}
// 							/>
// 						</Routes>
// 					</div>
// 					<Feedback />
// 				</FeedbackContext.Provider>
// 			</SocketContext.Provider>
// 		</>
// 	);
// }

// export default App;
