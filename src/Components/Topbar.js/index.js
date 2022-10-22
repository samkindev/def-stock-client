import React, { useState } from "react";
import "./Topbar.css";
import Box from "@mui/material/Box";
import { styled } from "@mui/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { NavLink } from "react-router-dom";
import {
	Avatar,
	IconButton,
	Typography,
	useTheme,
	Button,
	Divider,
	Chip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StockIcon from "@mui/icons-material/Inventory";
import CommandIcon from "@mui/icons-material/LocalGroceryStore";
import VenteIcon from "@mui/icons-material/Receipt";
import CpteIcon from "@mui/icons-material/CreditCard";
import PartenairesIcon from "@mui/icons-material/Groups";
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from "@mui/icons-material/Apps";
import { useSelector } from "react-redux";
import { getCurrentUser, getTaux, getDevise } from "../../app/reducers/auth";
import { getLoginRedirectUrl } from "../../utilities/helpers";

export default function Topbar({ title, children, paddingHorizontal = 2, paddingVertical = 1, style, ...other }) {
	const user = useSelector(getCurrentUser);
	const taux = useSelector(getTaux);
	const devise = useSelector(getDevise);
	const theme = useTheme();
	const [openMenu, setOpenMenu] = useState(false);

	const toggleMenu = (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setOpenMenu(!openMenu);
	};

	return (
		<div
			className="appbar"
			style={{
				backgroundColor: theme.palette.grey[200],
				padding: theme.spacing(paddingVertical, paddingHorizontal),
				borderBottom: "2px solid " + theme.palette.primary.light,
				...style
			}}
			{...other}
		>
			<Box display="flex" alignItems="center" minWidth={260}>
				<IconButton sx={{ mr: 2 }} onClick={toggleMenu}>
					<AppsIcon fontSize="small" />
				</IconButton>
				{openMenu && (
					<MainAppMenu open={openMenu} toggleMenu={toggleMenu} user={user} />
				)}
				<Typography
					color="primary"
					variant="h1"
					sx={{ fontWeight: 500 }}
				>
					GES | <Typography variant="caption" >{title}</Typography>
				</Typography>
			</Box>
			{children}
			<Box display='flex' alignItems="center">
				<Chip
					size="small"
					variant="contained"
					color="primary"
					label={`Taux ($-Fc): ${taux}Fc`}
					sx={{
						mr: 1
					}}
				/>
				<Chip
					size="small"
					variant="contained"
					color="primary"
					label={`Devise : ${devise}`}
					sx={{
						mr: 1
					}}
				/>
				<User theme={theme} user={user} />
			</Box>
		</div>
	);
}

// Le composant utilisateur
const User = ({ user }) => {
	return (
		<div className="user">
			<Avatar style={{ width: 25, height: 25, color: "#000" }} />
			<div className="user-detailes">
				<Typography variant="caption">
					{user && <span>{user.prenom}</span>}
				</Typography>
			</div>
			<ArrowDropDownIcon fontSize="small" color="inherit" />
		</div>
	);
};

const StyledMainMenuHeader = styled("div")(() => ({
	position: 'relative',
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: '10px'
}));

const StyledContentContainer = styled("div")(() => ({
	width: 300,
}));

const StyledMenuList = styled("div")(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	padding: '10px',
	"& .nav-link": {
		width: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		"&:not(:last-child)": {
			marginBottom: 7,
		},
		"&.active .line": {
			height: 3,
			width: '100%',
			backgroundColor: theme.palette.primary.main
		}
	}
}));

const StyledMenuCard = styled('div')(({ theme }) => ({
	padding: "10px 7px",
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	width: 'fit-content',
	borderRadius: 5,
	transition: 'all .2s',
	"&:hover": {
		boxShadow: theme.shadows[1],
		padding: "10px 20px",
	},
	"& > svg": {
		marginRight: 10
	},
	"& > span": {
		fontSize: 14
	},

}));

const StyledFooter = styled('div')(() => ({
	position: 'absolute',
	bottom: 0,
	left: 0,
	right: 0,
	"& > .copy-right": {
		display: 'block',
		fontSize: 14,
		padding: '15px 10px',
	}
}));

// Drop down Menu principal
const MainAppMenu = ({ open, user, toggleMenu }) => {
	return (
		<SwipeableDrawer
			anchor={"left"}
			open={open}
			onClose={toggleMenu}
			onOpen={toggleMenu}
			BackdropProps={{
				style: {
					backgroundColor: 'rgba(0, 0, 0, 0)'
				}
			}}
			PaperProps={{
				sx: {
					boxShadow: "10px -10px 30px 19px #52525257",
					borderRight: "1px solid #6faed9",
				}
			}}
		>
			<StyledContentContainer>
				<StyledMainMenuHeader>
					<IconButton sx={{ mr: 2 }} onClick={toggleMenu}>
						<AppsIcon fontSize="small" />
					</IconButton>
					<a href={getLoginRedirectUrl()}>
						<Button
							endIcon={<ArrowForwardIcon />}
							color="primary"
							variant="text"
						>
							Accueil
						</Button>
					</a>
				</StyledMainMenuHeader>
				<Box>
					<StyledMenuList>
						<Typography variant="h1" sx={{ mb: 3, fontWeight: 600, pl: 1 }}>Modules du GES</Typography>
						<NavLink to="/" className={(navData) => navData.isActive ? "nav-link active" : "nav-link"}>
							<StyledMenuCard>
								<CommandIcon color="success" />
								<Typography variant="caption">
									Gestion des commandes
								</Typography>
							</StyledMenuCard>
							<span className="line" />
						</NavLink>
						<NavLink to="/depots" className={(navData) => navData.isActive ? "nav-link active" : "nav-link"}>
							<StyledMenuCard>
								<StockIcon color="secondary" />
								<Typography variant="caption">
									Gestion des stocks dépôt
								</Typography>
							</StyledMenuCard>
							<span className="line" />
						</NavLink>
						<NavLink to="/facturation" className={(navData) => navData.isActive ? "nav-link active" : "nav-link"}>
							<StyledMenuCard>
								<VenteIcon color="default" />
								<Typography variant="caption">
									Vente et facturation
								</Typography>
							</StyledMenuCard>
							<span className="line" />
						</NavLink>
						<NavLink to="/" target="_blank" className={navData => navData.isActive ? "nav-link active" : "nav-link"}>
							<StyledMenuCard>
								<CpteIcon color="primary" />
								<Typography variant="caption">
									Comptabilité et caisse
								</Typography>
							</StyledMenuCard>
							<span className="line" />
						</NavLink>
						<NavLink to="/" target="_blank" className={navData => navData.isActive ? "nav-link active" : "nav-link"}>
							<StyledMenuCard>
								<PartenairesIcon color="info" />
								<Typography variant="caption">
									Partenaires de commerce
								</Typography>
							</StyledMenuCard>
							<span className="line" />
						</NavLink>
						<NavLink to="/configurations" target="_blank" className={navData => navData.isActive ? "nav-link active" : "nav-link"}>
							<StyledMenuCard>
								<SettingsIcon color="default" />
								<Typography variant="caption">
									Configurations
								</Typography>
							</StyledMenuCard>
							<span className="line" />
						</NavLink>
					</StyledMenuList>
				</Box>
			</StyledContentContainer>
			<StyledFooter>
				<Box display="flex" alignItems="center" p={1.5}>
					<Avatar sx={{ width: 30, height: 30, mr: 1, fontSize: 14 }}>
						{user.prenom[0]}
					</Avatar>
					<Typography variant="caption" className="small">
						{user.prenom} {user.postnom}
					</Typography>
				</Box>
				<Divider />
				<Typography variant="caption" className="copy-right" color="GrayText">&copy; GES tous droits reservés.</Typography>
			</StyledFooter>
		</SwipeableDrawer>
	);
};
