import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";

const AntTabs = styled(Tabs)({
	minHeight: "fit-content",
	maxWidth: 'fit-content',
	borderTop: '1px solid #eaeaea',
	"& .MuiTabs-indicator": {
		backgroundColor: "#666",
		transition: "all 50ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
		display: "none",
	},
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
	({ theme }) => ({
		textTransform: "none",
		minWidth: 0,
		minHeight: "fit-content",
		padding: "5px 16px",
		[theme.breakpoints.up("sm")]: {
			minWidth: 0,
		},
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: 0,
		color: "rgba(0, 0, 0, 0.85)",
		backgroundColor: "#fff",
		backgroundImage:
			"repeating-linear-gradient(177deg, #f5f5f5eb, #00000029 100px, #ffffff1c)",
		boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.6)",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
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
		"&:hover": {
			color: "#222",
			opacity: 1,
		},
		"&.Mui-selected": {
			color: "#222",
			fontWeight: theme.typography.fontWeightMedium,
			padding: "4px 14px",
			backgroundColor: "#fff",
			backgroundImage: "none",
			borderBottom: "none",
			borderTop: '1px solid rgba(0, 0, 0, 0.12)',
			boxShadow: 'none',
		},
		"&:last-child": {
			borderRight: '1px solid rgba(0, 0, 0, 0.12)',
		},
		"&.Mui-focusVisible": {
			backgroundColor: "#d1eaff",
		},
	})
);

const StyledContentContainer = styled(Box)(() => ({
	minHeight: "calc(100vh - 245px)",
	maxWidth: 600,
	border: '1px solid rgba(0, 0, 0, 0.12)',
	borderTop: 'none',
	backgroundColor: '#fff'
}));

const StyledContainer = styled(Box)(() => ({
	width: "fit-content",
}))

export default function ConfigurationTabs({ children, tabs, value, handleChange }) {
	return (
		<StyledContainer>
			<Box sx={{ bgcolor: "rgba(0,0,0,0)"}}>
				<Box display="flex" alignItems="flex-end">
					<AntTabs
						value={value}
						onChange={handleChange}
						aria-label="styled tabs"
					>
						{tabs.map((tab) => (
							<AntTab key={tab.id} label={tab.label} />
						))}
					</AntTabs>
					<Divider sx={{flex: 1}} />
				</Box>
				<StyledContentContainer sx={{ p: 1.5 }}>
					{children}
				</StyledContentContainer>
			</Box>
		</StyledContainer>
	);
}

