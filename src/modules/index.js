import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { HomeCard, MainFooter } from "../Components";
import StockIcon from "@mui/icons-material/Inventory";
import VenteIcon from "@mui/icons-material/CreditScore";

export default function HomePage() {
	return (
		<div className="home-page">
			<div className="inner-home-page">
				<Typography variant="h1" className="home-title">
					Bienvenu dans DEF / Vente des biens
				</Typography>
				<Typography variant="h2" className="home-sub-title">
					Opérations générales
				</Typography>
				<Box className="home-card-list">
					<HomeCard
						iconCompomponent={
							<StockIcon fontSize="large" color="primary" />
						}
						title="Stocks"
						secondTitle="Gestion des"
						path="/stock"
					/>
					<HomeCard
						iconCompomponent={
							<VenteIcon fontSize="large" color="secondary" />
						}
						title="Vente"
						secondTitle="Facturation et"
						path="/facturation"
					/>
				</Box>
			</div>
			<MainFooter />
		</div>
	);
}
