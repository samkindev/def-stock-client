import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/styles";
import {Link} from 'react-router-dom';

const columns = [
	{ id: "date", label: "Date", minWidth: 80 },
	{ id: "ref", label: "Référence", minWidth: 80, link: true, path: "#" },
	{ id: "libele", label: "Libelé", minWidth: 150 },
	{
		id: "qte",
		label: "Qté",
		minWidth: 80,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "pue",
		label: "C.U.",
		minWidth: 100,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "pte",
		label: "Montant",
		minWidth: 100,
		align: "right",
		format: (value) => value.toFixed(2),
	},
	{
		id: "qts",
		label: "Qté",
		minWidth: 80,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "pus",
		label: "P.U.",
		minWidth: 100,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "pts",
		label: "Montant",
		minWidth: 100,
		align: "right",
		format: (value) => value.toFixed(2),
	},
];

function createData(date, ref, libele, entree, sortie) {
	if (entree) {
		return {
			date, 
			ref,
			libele, 
			qte: entree.quantite_entree,
			pue: entree.cout_unitaire, 
			pte: entree.quantite_entree * entree.cout_unitaire, 
			qts: "", 
			pus: "", 
			pts: ""
		}
	} else if (sortie) {
		return { 
			date, 
			ref,
			libele, 
			qte: "", 
			pue: "", 
			pte: "", 
			qts: sortie.quantite_sortie, 
			pus: sortie.prix_unitaire, 
			pts: sortie.prix_unitaire * sortie.quantite_sortie
		};
	}
}

const getNature = row => row.num_entree ? 'Entrée' : "Sortie"

export default function ColumnGroupingTable({data}) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(12);

	const rows = data.map(d => {
		const nature = getNature(d);
		return createData(
			(new Date(d.createdAt)).toLocaleDateString(),
			nature === 'Entrée' ? d.reference_bon_entree : d.reference_facture,
			nature + " " + d['produit.designation'],
			nature === 'Entrée' && d,
			nature === 'Sortie' && d
		);
	});

	return (
		<StyledContainer>
			<Table stickyHeader aria-label="sticky table" size="small">
				<TableHead>
					<TableRow>
						<StyledTableCell className="bl" align="center" colSpan={3} />
						<StyledTableCell className="bl" align="center" colSpan={3}>
							Entrées
						</StyledTableCell>
						<StyledTableCell align="center" colSpan={3}>
							Sorties
						</StyledTableCell>
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<StyledTableCell
								key={column.id}
								align={column.align}
								style={{ minWidth: column.minWidth }}
                                className="bl"
							>
								{column.label}
							</StyledTableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows
						.slice(
							page * rowsPerPage,
							page * rowsPerPage + rowsPerPage
						)
						.map((row, i) => {
							return (
								<TableRow
									hover
									role="checkbox"
									tabIndex={-1}
									key={i + "_" +row.date}
								>
									{columns.map((column) => {
										const value = row[column.id];
										if (column.link) {
											return (
												<StyledTableCell
													key={column.id}
													align={column.align}
													className="bl"
												>
													<Link to={column.path + value}>
														{column.format &&
														typeof value === "number"
															? column.format(value)
															: value}
													</Link>
												</StyledTableCell>
											);
										}
										return (
											<StyledTableCell
												key={column.id}
												align={column.align}
                                                className="bl"
											>
												{column.format &&
												typeof value === "number"
													? column.format(value)
													: value}
											</StyledTableCell>
										);
									})}
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</StyledContainer>
	);
}

const StyledContainer = styled("div")(() => ({
	marginTop: 10,
	width: "100%",
	border: "1px solid #eaeaea",
	borderRadius: 5,
    overflow: 'hidden',
    overflowX: 'auto',
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
    fontSize: 14,
    "&.bl:not(:last-child)": {
        borderRight: "1px solid #eaeaea",
    },
	"& > a": {
		color: theme.palette.primary.main,
		"&:hover": {
			textDecoration: 'underline'
		}
	}
}));
