import { Box, Button, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import ApprovHistoryTable from '../components/ApprovHistoryTable';
import TimeRangePicker from '../components/TimeRangePicker';

export default function Historique() {
    return (
        <div className="historique-page">
            <header>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					background="#fff"
					padding="5px 15px"
					borderRadius="5px"
				>
					<Typography className="module-title">
						Historique des entrées
					</Typography>
					<Link to="/stock/nouveau_produit">
						<Button
							variant="text"
							color="primary"
						>
							Ajouter un produit
						</Button>
					</Link>
                </Box>
			</header>
            <div>
                {/* <TimeRangePicker value={[null, null]} /> */}
                <ApprovHistoryTable />
            </div>
        </div>
    )
}
