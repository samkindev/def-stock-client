import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material";
import {useSelector} from 'react-redux';
import {selectAll as selectEntrees} from '../../../app/reducers/entree';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: '#307ecc',
		color: theme.palette.common.white,
		fontSize: 15,
		padding: "7px 10px"
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		padding: "7px 10px"
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export default function ApprovisionnementTableau() {
	const theme = useTheme();
	const donnees = useSelector(selectEntrees);
	return (
		<TableContainer
			component={Paper}
			style={{
				boxShadow:
					"rgb(0 0 0 / 20%) 0px 1px 3px -2px, rgb(0 0 0 / 14%) 0px 1px 2px 0px, rgb(213 213 213 / 12%) 0px -1px 1px 0px",
			}}
		>
			<Table sx={{ minWidth: 700 }} aria-label="customized table">
				<TableHead>
					<TableRow>
						<StyledTableCell padding="checkbox">
							<Checkbox
								color="warning"
								inputProps={{
									"aria-label": "select all desserts",
								}}
							/>
						</StyledTableCell>
						<StyledTableCell align="right">N°</StyledTableCell>
						<StyledTableCell>entree/marchandises</StyledTableCell>
						<StyledTableCell>Code</StyledTableCell>
						<StyledTableCell>Nature</StyledTableCell>
						<StyledTableCell align="right">
							Quantité
						</StyledTableCell>
						<StyledTableCell align="right">
							C.U.
						</StyledTableCell>
						<StyledTableCell align="right">C.T.</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{donnees &&
						donnees.map((entree, i) => (
							<StyledTableRow key={entree.id}>
								<StyledTableCell padding="checkbox">
									<Checkbox
										size="small"
										color="primary"
										inputProps={{
											"aria-label": "select all desserts",
										}}
									/>
								</StyledTableCell>
								<StyledTableCell align="right">
									{i + 1}
								</StyledTableCell>
								<StyledTableCell
									style={{
										color: theme.palette.primary.main,
									}}
									component="th"
									scope="row"
								>
									{entree.produit.designation}
								</StyledTableCell>
								<StyledTableCell>
									{entree.produit.code_produit}
								</StyledTableCell>
								<StyledTableCell>
									{entree.produit.unite}
								</StyledTableCell>
								<StyledTableCell
									align="right"
								>
									{entree.quantite_entree}
								</StyledTableCell>
								<StyledTableCell align="right">
									{entree.cout_unitaire}
								</StyledTableCell>
								<StyledTableCell align="right">
									{parseFloat(entree.cout_unitaire) * parseFloat(entree.quantite_entree)}
								</StyledTableCell>
							</StyledTableRow>
						))}
					<StyledTableRow style={{ height: 35 }}>
						<StyledTableCell align="left"></StyledTableCell>
						<StyledTableCell align="center"></StyledTableCell>
						<StyledTableCell></StyledTableCell>
						<StyledTableCell></StyledTableCell>
						<StyledTableCell align="right"></StyledTableCell>
						<StyledTableCell align="right"></StyledTableCell>
						<StyledTableCell align="right"></StyledTableCell>
						<StyledTableCell align="right"></StyledTableCell>
					</StyledTableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
