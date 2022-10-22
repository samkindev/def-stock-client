import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	Page,
	Text,
	PDFViewer,
	Document,
	View,
	StyleSheet,
} from "@react-pdf/renderer";
import { Modal } from "@mui/material";
import axios from "axios";

// Create Document Component
export default function MyDocument() {
	const {numFacture} = useParams();
	const [facture, setFacture] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (numFacture) {
			axios
				.get(`/api/ventes/factures/${numFacture}`)
				.then(({ data }) => {
					console.log(data);
					if (data) {
						setFacture(data);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [numFacture]);
	console.log(facture);
	return (
		<Modal open={true}>
			<div style={styles.frameContainer}>
				{(loading || !facture) ? (
					<></>
				) : (
					<PDFViewer width="100%" height="100%">
						<Document>
							<Page style={styles.body}>
								<View style={styles.header}>
									<View style={styles.headerSide}>
										<Text style={styles.headerText}>
											Ste New Four Ways SARL-Mini
										</Text>
										<Text style={styles.headerText}>
											DEF-012334
										</Text>
										<Text style={styles.headerText}>
											Av: UBANGI NO.2 C/LEMBA
										</Text>
										<Text style={styles.headerText}>
											0971178768 - 0890011442
										</Text>
										<Text style={styles.headerText}>
											samkin1997@gmail.com
										</Text>
										<Text style={styles.headerText}>
											RCCM 14-B-01702 IDNAT
											01-F4300-N34731P
										</Text>
										<Text style={styles.headerText}>
											NIMPOT A0909296Q
										</Text>
									</View>
									<View style={styles.headerSide}>
										<Text style={styles.headerText}>
											Ste New Four Ways SARL-Mini
										</Text>
										<Text style={styles.headerText}>
											DEF-012334
										</Text>
										<Text style={styles.headerText}>
											Av: UBANGI NO.2 C/LEMBA
										</Text>
										<Text style={styles.headerText}>
											0971178768 - 0890011442
										</Text>
										<Text style={styles.headerText}>
											samkin1997@gmail.com
										</Text>
										<Text style={styles.headerText}>
											RCCM 14-B-01702 IDNAT
											01-F4300-N34731P
										</Text>
										<Text style={styles.headerText}>
											NIMPOT A0909296Q
										</Text>
									</View>
								</View>
								<View style={styles.alignH}>
									<Text
										style={[
											styles.text,
											{ marginRight: 10 },
										]}
									>
										#{facture.num_facture}
									</Text>
									<Text
										style={[
											styles.text,
											{ marginRight: 10 },
										]}
									>
										{(new Date(facture.date)).toLocaleDateString()}
									</Text>
									<Text style={styles.text}>
										{(new Date(facture.date)).toLocaleTimeString()}
									</Text>
								</View>
								<View style={styles.table}>
									<TabHeader />
									<View style={styles.tabBody}>
										{facture.produits.map(produit => (
											<TabRow produit={produit} key={produit.designation} />
										))}
									</View>
									<TabFooter totalHT={facture.total_ht} tva={facture.total_tva} />
								</View>
							</Page>
						</Document>
					</PDFViewer>
				)}
			</div>
		</Modal>
	);
}
const TabHeader = () => {
	return (
		<View
			style={{
				...styles.tabHeader,
				...styles.tabRow,
			}}
		>
			<Text
				style={{
					...styles.tabCol,
					...styles.designation,
				}}
			>
				Article/Iteme
			</Text>
			<Text
				style={{
					...styles.tabCol,
					...styles.pu,
				}}
			>
				Prix U
			</Text>
			<Text
				style={{
					...styles.tabCol,
					...styles.quantite,
				}}
			>
				Qté
			</Text>
			<Text
				style={{
					...styles.tabCol,
					...styles.total,
				}}
			>
				Total
			</Text>
		</View>
	);
};

const TabRow = ({produit}) => {
	return (
		<View
			style={{
				...styles.tabRow,
			}}
		>
			<Text style={[styles.tabCol, styles.designation]}>
				{produit.designation}
			</Text>
			<Text
				style={{
					...styles.tabCol,
					...styles.pu,
				}}
			>
				{produit.prix_unitaire}
			</Text>
			<Text style={[styles.tabCol, styles.quantite]}>
				{produit.q_sortie}
			</Text>
			<Text
				style={{
					...styles.tabCol,
					...styles.total,
				}}
			>
				{produit.total}
			</Text>
		</View>
	);
};
const TabFooter = ({totalHT, tva}) => {
	return (
		<View style={styles.tabFooter}>
			<View style={styles.footerContent}>
				<View style={styles.labelContainer}>
					<Text style={styles.footerRow}>Total HT</Text>
					<Text style={styles.footerRow}>TVA (16%)</Text>
					<Text style={styles.footerRow}>Autres taxes</Text>
					<Text
						style={[
							styles.footerRow,
							{
								fontWeight: "bold",
								fontSize: 15,
								borderTopColor: "#333",
								borderStyle: "dashed",
								borderTopWidth: 1,
								marginTop: 10,
							},
						]}
					>
						Total à payer
					</Text>
				</View>
				<View style={styles.valueContainer}>
					<Text style={styles.footerRow}>{totalHT}</Text>
					<Text style={styles.footerRow}>{tva}</Text>
					<Text style={styles.footerRow}>0</Text>
					<Text
						style={[
							styles.footerRow,
							{
								fontWeight: "bold",
								fontSize: 15,
								borderTopColor: "#333",
								borderStyle: "dashed",
								borderTopWidth: 1,
								marginTop: 10,
							},
						]}
					>
						{totalHT + tva}
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	frameContainer: {
		height: "100vh",
		width: "100vw",
	},
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	alignH: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 20,
	},
	header: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	headerSide: {
		textAlign: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	headerText: {
		fontSize: 12,
		fontFamily: "Times-Roman",
	},
	text: {
		marginVertical: 11,
		fontSize: 12,
		fontFamily: "Times-Roman",
	},
	table: {
		marginTop: 20,
		width: "100%",
	},
	tabHeader: {
		borderBottomColor: "#333",
		borderStyle: "dashed",
		borderBottomWidth: 1,
		fontStyle: "bold",
	},
	tabRow: {
		display: "flex",
		flexDirection: "row",
	},
	designation: {
		paddingVertical: 5,
		flexBasis: "40%",
		fontSize: 12,
		fontFamily: "Times-Roman",
		textAlign: "left",
	},
	pu: {
		paddingVertical: 5,
		flexBasis: "20%",
		fontSize: 12,
		fontFamily: "Times-Roman",
		textAlign: "right",
	},
	quantite: {
		paddingVertical: 5,
		flexBasis: "20%",
		fontSize: 12,
		fontFamily: "Times-Roman",
		textAlign: "right",
	},
	total: {
		paddingVertical: 5,
		flexBasis: "20%",
		fontSize: 12,
		fontFamily: "Times-Roman",
		textAlign: "right",
	},
	tabFooter: {
		flexDirection: "row",
		borderTopColor: "#333",
		borderStyle: "dashed",
		borderTopWidth: 1,
		justifyContent: "flex-end",
		paddingTop: 10,
	},
	footerContent: {
		flexDirection: "row",
		alignItems: "center",
		fontFamily: "Times-Roman",
	},
	footerRow: {
		fontSize: 12,
		padding: 3,
	},
	labelContainer: {
		flexBasis: "20%",
		textAlign: "right",
	},
	valueContainer: {
		flexBasis: "20%",
		textAlign: "right",
	},
});
