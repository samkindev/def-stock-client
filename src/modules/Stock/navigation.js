import React, { useContext, useState, useEffect } from "react";
import "./stock.styles.css";
import "./components/component.style.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import PageProduit from "./pages/Produit";
import StockSideBar from "./components/SideBar";
import ApprovisionnementPage from "./pages/Approvisionnement";
import FicheStockPage from "./pages/FicheStock";
import NouveauProduit from "./pages/NouveauProduit";
import Historique from "./pages/Historique";
import useConnectSocket from "../../sockets";
import { SocketContext } from "../../App";
import Configuration from "./pages/Configuration";
import SplashPage from "./pages/Splash";

export default function NavigationStock() {
	const [canPass, setCanPass] = useState(false);
	const [isConfig, setIsConfig] = useState(false);
	// Initialize the sockets for the stock module
	const socket = useContext(SocketContext);
	useConnectSocket(socket, "gestion_stock");

	// Fonction qui permet de passer si toutes les configurations son verifiées
	const enableCanPass = () => {
		setCanPass(true);
	}

	const navigate = useNavigate();
	const goToConfig = () => {
		navigate('configurations');
		setIsConfig(true);
	}

	return (
		<div>
			{canPass ?
				<>
					<StockSideBar />
					<main className="main-stock">
						<Routes>
							<Route path="/produits" element={<PageProduit />} />
							<Route
								path="/nouveau_produit"
								element={<NouveauProduit />}
							/>
							<Route
								path="approvisionnement"
								element={<ApprovisionnementPage />}
							/>
							<Route
								path="/historique_approvisionnement"
								element={<Historique />}
							/>
							<Route path="fiche_de_stock" element={<FicheStockPage />} />
							<Route path="/" element={<PageProduit />} />
							<Route path="/*" element={<Navigate to="/stock" />} />
						</Routes>
					</main>
				</> :
				<SplashPage onConfigOk={enableCanPass} goToConfig={goToConfig} />
			}
		</div>
	);
}
