import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import {
	Typography,
	TextField,
	Button,
	IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { ComboBox, DateMaskInput } from "../../../Components";
import { Close } from "@mui/icons-material";

export default function MultipleFormApprov({ open, onClose }) {
	return (
		<Modal onClose={onClose} open={open}>
			<form className="multiple-form">
				<div className="form-header">
					<Box
						borderBottom="1px solid #eaeaea"
						mb={2}
						display="flex"
						alignItems="center"
                        justifyContent="space-between"
					>
						<Typography variant="h2" className="block-title">
							Entée des produits/marchandises en stock
						</Typography>
						<IconButton onClick={onClose}>
							<Close fontSize="small" />
						</IconButton>
					</Box>
					<Button variant="contained" disableElevation type="submit">
						Enregistrer
					</Button>
				</div>
				<div className="form-rows">
					<div className="form-row rows-header">
						<TextField
							label="Num"
							id="quantite_si"
							name="quantite_si"
							variant="outlined"
							disabled
							inputProps={{
								style: {
									textAlign: "right",
								},
							}}
							sx={{
								minWidth: 60,
							}}
						/>
						<TextField
							id="produit"
							name="produit"
							label="Produit"
							variant="outlined"
							fullWidth
							sx={{ minWidth: 300 }}
							disabled
						/>
						<TextField
							id="quantite"
							name="quantite"
							label="Quantité"
							variant="outlined"
							fullWidth
							disabled
						/>
						<TextField
							id="cu"
							name="cu"
							label="C.U."
							placeholder="C.U."
							variant="outlined"
							fullWidth
							disabled
						/>
						<DateMaskInput
							id="exp"
							name="exp"
							label="Date d'expiration"
							variant="outlined"
							fullWidth
							disabled
						/>
					</div>
					{new Array(10).fill(0).map((arr, index) => (
						<Row key={index} num={index + 1} />
					))}
				</div>
			</form>
		</Modal>
	);
}

const Row = ({ setRowsHandler, num }) => {
	// const [produit, setProduit] = useState("");
	const [quantite, setQuantite] = useState(0);
	const [cu, setCu] = useState(0);
	// const [marge, setMarge] = useState(0);
	const [dateExp, setDateExp] = useState();

	const dateExpChange = (event) => {
		setDateExp(event.target.value);
	};

	return (
		<div className="form-row">
			<TextField
				id="quantite_si"
				name="quantite_si"
				variant="outlined"
				defaultValue={num}
				disabled
				inputProps={{
					style: {
						textAlign: "right",
					},
				}}
				sx={{
					minWidth: 60,
				}}
			/>
			<ComboBox label={false} />
			<TextField
				id="quantite_si"
				name="quantite_si"
				placeholder="Quantité stock initial"
				variant="outlined"
				fullWidth
				type="number"
				value={quantite}
				onChange={(e) => setQuantite(e.target.value)}
			/>
			<TextField
				id="cu"
				name="cu"
				placeholder="Coût unitaire du produit"
				variant="outlined"
				fullWidth
				type="number"
				value={cu}
				onChange={(e) => setCu(e.target.value)}
			/>
			<DateMaskInput
				value={dateExp}
				onChange={dateExpChange}
				id="exp"
				name="exp"
				placeholder="_ _ /_ _ /20_ _"
				variant="outlined"
				fullWidth
			/>
		</div>
	);
};
