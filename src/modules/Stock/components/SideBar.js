import React, { useState } from "react";
import { ListItemText, ListItemButton, ListItemIcon } from "@mui/material";
import { Box } from "@mui/system";
import { NavLink } from "react-router-dom";
import ApprovIcon from "@mui/icons-material/FileDownload";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import KeyBoardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function StockSideBar() {
	const [openProduit, setOpenProduit] = useState(true);
	const [openApprov, setOpenApprov] = useState(true);

	return (
		<div
			className="fleft-sidebar"
			style={{
				color: "#444",
				borderRight: "1px solid #ccc",
			}}
		>
			<div className="inner-sidebar">
				<menu>
					<ListItemButton
						alignItems="center"
						onClick={() => setOpenProduit(!openProduit)}
						sx={{
							pr: 2,
							"&:hover, &:focus": {},
						}}
					>
						<ListItemIcon
							sx={{
								color: "inherit",
								minWidth: "fit-content",
								marginRight: 1.5,
								marginTop: 0,
							}}
						>
							<Inventory2Icon fontSize="small" />
						</ListItemIcon>
						<ListItemText
							primary={"Produits"}
							primaryTypographyProps={{
								fontSize: 14,
								fontWeight: "medium",
								lineHeight: "20px",
								mb: "2px",
							}}
							secondaryTypographyProps={{
								noWrap: true,
								fontSize: 12,
								lineHeight: "16px",
							}}
							sx={{ my: 0 }}
						/>
						<KeyBoardArrowDownIcon
							sx={{
								opacity: openProduit ? 1 : 0,
								transform: openProduit
									? "rotate(-180deg)"
									: "rotate(0)",
								transition: "0.2s",
							}}
						/>
					</ListItemButton>
					{openProduit && (
						<Box pl={4.5}>
							<NavLink
								to="produits"
								className={({ isActive }) =>
									isActive ? "active-navlink" : "navlink"
								}
							>
								<ListItemButton>
									<ListItemText
										primary="Liste des produits"
										primaryTypographyProps={{
											fontSize: 13,
											fontWeight: "medium",
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis'
										}}
										sx={{
											mb: 0,
										}}
									/>
								</ListItemButton>
							</NavLink>
							<NavLink
								to="nouveau_produit"
								className={({ isActive }) =>
									isActive ? "active-navlink" : "navlink"
								}
							>
								<ListItemButton>
									<ListItemText
										primary="Ajouter des produits"
										primaryTypographyProps={{
											fontSize: 13,
											fontWeight: "medium",
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis'
										}}
									/>
								</ListItemButton>
							</NavLink>
						</Box>
					)}
					<ListItemButton
						alignItems="center"
						onClick={() => setOpenApprov(!openApprov)}
						sx={{
							pr: 2,
							"&:hover, &:focus": {},
						}}
					>
						<ListItemIcon
							sx={{
								color: "inherit",
								minWidth: "fit-content",
								marginRight: 1.5,
							}}
						>
							<ApprovIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText
							primary={"Approvisionnement"}
							primaryTypographyProps={{
								fontSize: 14,
								fontWeight: "medium",
								lineHeight: "20px",
								mb: "2px",
								textOverflow: 'ellipsis',
								overflow: openApprov ? 'hidden' : 'initial'
							}}
							secondaryTypographyProps={{
								noWrap: true,
								fontSize: 12,
								lineHeight: "16px",
							}}
							sx={{ my: 0 }}
						/>
						<KeyBoardArrowDownIcon
							sx={{
								opacity: openApprov ? 1 : 0,
								transform: openApprov
									? "rotate(-180deg)"
									: "rotate(0)",
								transition: "0.2s",
							}}
						/>
					</ListItemButton>
					{openApprov && (
						<Box pl={4.5}>
							<NavLink
								to="approvisionnement"
								className={({ isActive }) =>
									isActive ? "active-navlink" : "navlink"
								}
							>
								<ListItemButton>
									<ListItemText
										primary="Nouvel approvisionnement"
										primaryTypographyProps={{
											fontSize: 13,
											fontWeight: "medium",
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis',
										}}
										sx={{
											mb: 0
										}}
									/>
								</ListItemButton>
							</NavLink>
							<NavLink
								to="historique_approvisionnement"
								className={({ isActive }) =>
									isActive ? "active-navlink" : "navlink"
								}
							>
								<ListItemButton>
									<ListItemText
										primary="Historique"
										primaryTypographyProps={{
											fontSize: 13,
											fontWeight: "medium",
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis'
										}}
									/>
								</ListItemButton>
							</NavLink>
						</Box>
					)}
					<NavLink
						to="fiche_de_stock"
						className={({ isActive }) =>
							isActive ? "active-navlink" : "navlink"
						}
					>
						<ListItemButton
							sx={{ py: 0, minHeight: 40, color: "inherit" }}
						>
							<ListItemIcon
								sx={{
									color: "inherit",
									minWidth: "fit-content",
									marginRight: 1.5,
								}}
							>
								<ListAltIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText
								primary={"Fiche de stock"}
								primaryTypographyProps={{
									fontSize: 14,
									fontWeight: "medium",
								}}
							/>
						</ListItemButton>
					</NavLink>
					<NavLink
						to="alertes"
						className={({ isActive }) =>
							isActive ? "active-navlink" : "navlink"
						}
					>
						<ListItemButton
							sx={{ py: 0, minHeight: 40, color: "inherit" }}
						>
							<ListItemIcon
								sx={{
									color: "inherit",
									minWidth: "fit-content",
									marginRight: 1.5,
								}}
							>
								<NotificationImportantIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText
								primary={"Alertes"}
								primaryTypographyProps={{
									fontSize: 14,
									fontWeight: "medium",
								}}
							/>
						</ListItemButton>
					</NavLink>
				</menu>
			</div>
		</div>
	);
}
