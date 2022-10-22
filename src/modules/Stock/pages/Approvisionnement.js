import React, {useEffect} from "react";
import { Box } from "@mui/material";
import FormApprovisionnement from "../components/FormApprovisionnement";
import ApprovisionnementTableau from "../components/TableApprovisionnement";
import {getEntreeNumeros} from "../../../app/reducers/entree";
import {getStockPrincipal} from '../../../app/reducers/stock';
import {useSelector, useDispatch} from 'react-redux';

export default function Approvisionnement() {
	const stock = useSelector(getStockPrincipal);
	const dispatch = useDispatch();
	useEffect(() => {
		if (stock) {
			dispatch(getEntreeNumeros());
		}
	}, [dispatch, stock]);
	return (
		<div className="approv-container">
			<FormApprovisionnement />
			<Box mt={2} p="0 10px">
				<ApprovisionnementTableau />
			</Box>
		</div>
	);
}
