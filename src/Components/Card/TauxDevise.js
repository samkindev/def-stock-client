import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { useSelector } from "react-redux";
import { getTaux, getDevise } from "../../app/reducers/config";
import { formatNumber } from "../../utilities/helpers";

const StyledContainer = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	flex: 1,
}));
const StyledInfo = styled(Typography)(() => ({
	display: "flex",
	alignItems: "center",
	color: "#666",
	"&": {
		fontSize: 14,
	},
	"& .value": {
		fontSize: 20,
		fontWeight: "600",
        marginLeft: 10
	},
}));
export default function TauxDevise() {
	const taux = useSelector(getTaux);
	const devise = useSelector(getDevise);
	return (
		<div style={{ marginTop: 24 }}>
			<Typography variant="h2" className="block-title">
				Devise et taux
			</Typography>
			<StyledContainer
				aria-label="provenance"
				name="provenance des produits ou marchandises"
				value={devise}
				className="devise"
				sx={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
				}}
			>
				<StyledInfo>
					<span>Devise :  </span><span className="value">{devise}</span>
				</StyledInfo>
				<StyledInfo>
					<span>Taux : </span><span className="value">{formatNumber(taux)}Fc</span>
				</StyledInfo>
			</StyledContainer>
		</div>
	);
}
