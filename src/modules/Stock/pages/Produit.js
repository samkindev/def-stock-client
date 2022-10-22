import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import ProduitTableau from "../components/ProduitTableau";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { getProduits } from "../../../app/reducers/stockProduit";
import FormProduitModal from "../components/FormProduitModal";

export default function Produits() {
	const dispatch = useDispatch();
	const [openNouveauProduit, setOpenNouveauProduit] = useState(false);

	const toggleNouveauProduit = () => {
		setOpenNouveauProduit(!openNouveauProduit);
	};

	useEffect(() => {
		dispatch(getProduits());
	}, [dispatch]);

	return (
		<div className="module-page">
			<header>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					background="#fff"
					padding="5px 0"
					borderRadius="5px"
				>
					<Typography className="module-title">
						Produits
						<span className="small">>> Liste des produits</span>
					</Typography>
					<Button
						variant="text"
						color="primary"
						startIcon={<AddIcon />}
						onClick={toggleNouveauProduit}
					>
						Nouveau produit
					</Button>
					{openNouveauProduit && <FormProduitModal open={openNouveauProduit} onClose={toggleNouveauProduit} />}
				</Box>
			</header>
			<section className="produits">
				<Box
					sx={{
						transition: "all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
					}}
				>
					<ProduitTableau />
				</Box>
			</section>
		</div>
	);
}
