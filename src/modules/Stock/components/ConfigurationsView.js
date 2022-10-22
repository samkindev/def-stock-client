import React from 'react';
import { Modal, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/styles';
import { Box } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { actions, selectAll as selectAllMagasins, getSaveState, getError } from '../../../app/reducers/depot';
import CheckIcon from '@mui/icons-material/Check'
import { LargeDialog } from '../../../Components';

const StyledContainer = styled('div')(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledContentContainer = styled('div')(() => ({
  backgroundColor: '#fff',
  border: '1px solid #9a9a9a',
  boxShadow: '0px 0px 16px 11px #cfcdcd',
  maxWidth: 600,
  minWidth: 500,
  minHeight: 'calc(100vh - 200px)',
  borderRadius: 8,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  "& header": {
    padding: '15px',
    backgroundColor: '#faf8ff',
    borderBottom: '2px solid rgb(111, 174, 217)',
    "& h2": {
      fontWeight: 'bold!important',
      color: '#222',
      marginBottom: '0!important'
    }
  },
  "& .body": {
    padding: '15px',
    flex: 1,
  },
  "& .footer": {
    padding: '15px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
}));

const StyledTreeController = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  border: '1px solid #eaeaea',
  borderRadius: 7,
  padding: '10px 15px'
}));

const StyledConfigItem = styled(Typography)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  fontSize: '14px!important',
  "& .value": {
    color: '#222',
  },
  "&.column": {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 16,
    "& span:first-of-type": {
      fontSize: '14px!important',
      fontWeight: 'bold',
      color: '#555',
    },
    "& .value": {
      marginLeft: 16
    }
  }
}));

const StyledTable = styled('table')(() => ({
  width: '100%',
  border: '1px solid #eaeaea',
  borderRadius: 8,
  overflow: 'hidden',
  maxHeight: 130,
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  "& header": {
    padding: '5px 10px',
  },
  "& td": {
    padding: '5px 10px',
    textAlign: 'left',
    color: '#333',
    fontSize: 14,
    "&:not(:last-child)": {
      borderRight: '1px solid #eaeaea',
    }
  },
  "& th": {
    padding: '5px 10px',
    textAlign: 'left',
    "&:not(:last-child)": {
      borderRight: '1px solid #eaeaea',
    }
  },
  "& thead": {
    backgroundColor: '#faf8ff',
    borderBottom: '1px solid #eaeaea',
  },
  "& tbody": {
    overflowY: 'scroll',
  }
}));


export default function ConfigurationsView({ open, onClose, configurations, handleConfirmation }) {
  const magasins = useSelector(selectAllMagasins);
  const error = useSelector(getError);
  const loading = useSelector(getSaveState);
  const dispatch = useDispatch();
  const handleClearServerErrors = () => {
    dispatch(actions.clearError());
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: "#00000012",
        }
      }}
    >
      <StyledContainer>
        <StyledContentContainer>
          <header>
            <Typography variant="h2">Configuration de la gestion des stocks</Typography>
          </header>
          <Box className="body">
            <Typography variant="h2">Organisation des stocks</Typography>
            <StyledTreeController component='ul'>
              <StyledConfigItem variant="caption">
                <span>Organistion par rangées : </span>
                <span className="value">{configurations.organisation}</span>
              </StyledConfigItem>
              <StyledConfigItem variant="caption">
                <span>Emplacement dans les rangées : </span>
                <span className="value">{configurations.subdivision ? configurations.subdivision : 'Non défini'}</span>
              </StyledConfigItem>
              <StyledConfigItem variant="caption">
                <span>Référence des rangées : </span>
                <span className="value">{configurations.referenceRangees ? configurations.referenceRangees : 'Non défini'}</span>
              </StyledConfigItem>
              <StyledConfigItem variant="caption">
                <span>Référence des produits : </span>
                <span className="value">{configurations.referenceProduits ? configurations.referenceProduits : 'Non défini'}</span>
              </StyledConfigItem>
            </StyledTreeController>
            <StyledConfigItem variant="caption" className="column">
              <span>Méthode de réaprovisionnement : </span>
              <span className="value">{configurations.reaprovisionnement}</span>
            </StyledConfigItem>
            <StyledConfigItem variant="caption" className="column">
              <span>Méthode de valorisation : </span>
              <span className="value">{configurations.valorisation}</span>
            </StyledConfigItem>
            <Box my={2}>
              <Typography variant="h2">Liste des magasins/dépots</Typography>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Nom</th>
                  </tr>
                </thead>
                <tbody>
                  {magasins.length > 0 ?
                    magasins.map(mag => (
                      <tr>
                        <td>{mag.code_magasin}</td>
                        <td>{mag.nom_magasin}</td>
                      </tr>
                    )) :
                    <tr>
                      <td>M001</td>
                      <td>Magasin Principal</td>
                    </tr>
                  }
                </tbody>
              </StyledTable>
            </Box>
          </Box>
          <Box px={1.875}>
            <Typography variant="caption" className="small">En cliquant sur <strong>Confirmer</strong> vous acceptez les configurations ci-dessus pour tous vos magasins.<br />Notez que ces modifications peuvent être modifiées ulterieurement.</Typography>
          </Box>
          <Box className="footer">
            <Button
              variant="outlined"
              color="default"
              disableElevation
              size='medium'
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              size='medium'
              onClick={handleConfirmation}
              startIcon={!loading && <CheckIcon />}
              sx={{
                minWidth: 130,
                height: 36.5,
                ml: 2
              }}
            >
              {loading ? (
                <CircularProgress size={12} color="inherit" />
              ) : (
                "Confirmer"
              )}
            </Button>
            {error &&
              <LargeDialog
                title="Erreur"
                open={error ? true : false}
                message="Une erreur s'est produite lors de l'enregistrement des configurations."
                onAgree={handleClearServerErrors}
                onClose={handleClearServerErrors}
                agreeBtnText="Ok"
              />
            }
          </Box>
        </StyledContentContainer>
      </StyledContainer>
    </Modal >
  )
}
