import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function HomeCard({
	title,
	secondTitle,
	iconCompomponent,
	path,
}) {
	return (
		<Link to={path} className="home-card">
			<div className="card-h">{iconCompomponent}</div>
			<div className="card-b">
				<Typography variant="body2">{secondTitle}</Typography>
				<Typography variant="h2">{title}</Typography>
			</div>
		</Link>
	);
}
