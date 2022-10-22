import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/styles";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatNumber } from "../../../utilities/helpers";

export default function ApprovProduitList({
	approvProduits = [],
	numApprov = 0,
	removeProduit,
}) {
	return (
		<StyledContainer>
			<Box>
				<StyledHeader>
					<div>
						<DownloadIcon fontSize="small" />
						<span>{approvProduits.length} produits</span>
					</div>
					<span>N° {numApprov}</span>
				</StyledHeader>
				<StyledList>
					{approvProduits.map((pApprov, i) => (
						<StyledRow key={i}>
							<StyledCol className="action">
								<Tooltip title="Enlever">
									<IconButton
										onClick={() => removeProduit(pApprov)}
									>
										<DeleteOutlineIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</StyledCol>
							<StyledCol className="fill">
								{pApprov.designation}
							</StyledCol>
							<StyledCol className="right">
								{pApprov.quantite}
							</StyledCol>
							<StyledCol className="right">
								{formatNumber(pApprov.cout_u)}
							</StyledCol>
						</StyledRow>
					))}
				</StyledList>
			</Box>
		</StyledContainer>
	);
}

const StyledContainer = styled("div")(() => ({
	fontFamily: [
		"-apple-system",
		"BlinkMacSystemFont",
		'"Segoe UI"',
		"Roboto",
		'"Helvetica Neue"',
		"Arial",
		"sans-serif",
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(","),
	border: "1px solid #d9d9d9",
	borderRadius: 5,
	margin: "15px 0",
	overflow: "hidden",
}));

const StyledHeader = styled("div")(() => ({
	padding: "8px 16px",
	backgroundColor: "#f6f8fa",
	borderTopLeftRadius: 6,
	borderTopRightRadius: 6,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	"&>div": {
		display: "flex",
		alignItems: "center",
		"&>*:first-of-type": {
			marginRight: 10,
		},
	},
}));

const StyledList = styled("div")(() => ({}));

const StyledCol = styled("div")(() => ({
	width: "25%",
	padding: "8px 10px",
	"&.fill": {
		width: "35%",
	},
	"&.right": {
		textAlign: "right",
	},
	"&.action": {
		width: "15%",
		padding: "0 10px",
	},
}));

const StyledRow = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "baseline",
	borderTop: "1px solid #d0d7de",
}));
