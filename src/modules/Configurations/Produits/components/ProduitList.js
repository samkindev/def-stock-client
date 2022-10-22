import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EditIcon from '@mui/icons-material/Edit';
import TableProduit from './ProduitTable';
import NewProduitForm from './NewProduitForm';
import { changeProductsEtat, deleteProduct, getDeletingState, getUpdating } from '../../../../app/reducers/myProduct';
import { FeedbackContext } from '../../../../App';
import { LargeDialog } from '../../../../Components';
import { VisibilityOutlined } from '@mui/icons-material';
import ProduitUpdateForm from './UpdateForm';

const StyledContainer = styled("div")(() => ({

}));

const StyledActions = styled("div")(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: "5px 10px",
    "& > *:not(:first-of-type)": {
        marginLeft: 10
    }
}));

export default function ProduitList() {
    const location = useLocation();
    const [openForm, setOpenForm] = useState(false);
    const [openUpdateForm, setOpenUpdateForm] = useState(false);
    const [selectedProds, setSelectedProds] = useState([]);
    const [del, setDel] = useState(false);
    const [disable, setDisable] = useState(false);
    const [status, setStatus] = useState('');
    const dispatch = useDispatch();
    const { createFeedback } = useContext(FeedbackContext);
    const deleting = useSelector(getDeletingState);
    const updating = useSelector(getUpdating);
    const hasSelected = selectedProds.length > 0;
    const isSingleSelected = selectedProds.length === 1;
    const canSetVisibility = hasSelected && selectedProds.every(s => s.etat_produit === 'caché');
    const canDisableVisibility = hasSelected && selectedProds.every(s => s.etat_produit === 'visible');

    const toggleOpenForm = () => {
        setOpenForm(!openForm);
    }

    const toggleUpdateForm = () => {
        if (openUpdateForm) {
            setSelectedProds([]);
        }
        setOpenUpdateForm(!openUpdateForm);
    }

    const toggleDelete = () => {
        if (isSingleSelected) {
            setDel(!del);
        }
    }

    const toggleDisable = (status) => {
        if (hasSelected) {
            setDisable(!disable);
            setStatus(status);
        }
    }

    const handleDeleteProduct = () => {
        if (isSingleSelected) {
            const id = selectedProds[0].id;

            dispatch(deleteProduct(id)).then(res => {
                const d = res.payload;
                setDel(false);
                if (d.status === 'success') {
                    setSelectedProds([]);
                    createFeedback(
                        "Suppression effectuée avec succès !",
                        "suppression d'un produit",
                        "warning"
                    );
                }
            });
        }
    }

    const handleChangeStatusProducts = () => {
        if (hasSelected) {
            const ids = selectedProds.map(s => s.id);
            dispatch(changeProductsEtat({ ids, status })).then(res => {
                const d = res.payload;
                setDisable(false);
                if (d.status === 'success') {
                    setSelectedProds([]);
                    createFeedback(
                        "Mise à jour effectuée avec succès !",
                        "mise à jour d'un produit",
                        "success"
                    );
                }
            });
        }
    }

    return (
        <StyledContainer>
            {del &&
                <LargeDialog
                    message="Voulez-vous supprimer ce produit ?"
                    agreeBtnText={"Oui"}
                    disagreeBtnText="Annuler"
                    onAgree={handleDeleteProduct}
                    onDisagree={toggleDelete}
                    open={del}
                    title="Suppression"
                    loading={deleting}
                />
            }
            {disable &&
                <LargeDialog
                    message={
                        status === 'disabled' ?
                            "Voulez-vous cacher ce(s) produit(s) ? Il(s) ne sera(seront) pas visible(s) dans tous vos dépôts même lors des ventes." :
                            "Voulez-vous rendre visible ce(s) produit(s) dans vos dépôts ou magasins ?"
                    }
                    agreeBtnText={"Oui"}
                    disagreeBtnText="Annuler"
                    onAgree={handleChangeStatusProducts}
                    onDisagree={toggleDisable}
                    open={disable}
                    title={status === 'disabled' ? "Cacher produit(s)" : "Rendre produit(s) visible(s)"}
                    loading={updating}
                />
            }
            <StyledActions>
                <Link to="nouveau" state={{ backgroundLocation: location }}>
                    <Button
                        endIcon={<AddIcon />}
                        disableElevation
                        variant='outlined'
                        color="primary"
                        size='small'
                        type="submit"
                    >Nouveau produit</Button>
                </Link>
                <Link to={selectedProds.length ? selectedProds[0].id : ""} state={{ backgroundLocation: location }}>
                    <Button
                        endIcon={<InfoIcon />}
                        disableElevation
                        variant='text'
                        color="default"
                        size='small'
                        type="submit"
                        disabled={!isSingleSelected}
                    >Détails</Button>
                </Link>
                <Link to={`${selectedProds.length ? selectedProds[0].id : ""}/update`} state={{ backgroundLocation: location }}>
                    <Button
                        endIcon={<EditIcon />}
                        disableElevation
                        variant='text'
                        color="default"
                        size='small'
                        type="submit"
                        disabled={!isSingleSelected || canSetVisibility}
                    // onClick={toggleUpdateForm}
                    >Modifier</Button>
                </Link>
                <Button
                    endIcon={<DeleteOutlineIcon />}
                    disableElevation
                    variant='text'
                    color="default"
                    size='small'
                    type="submit"
                    disabled={!isSingleSelected}
                    onClick={toggleDelete}
                >Supprimer</Button>
                <Button
                    endIcon={<VisibilityOffOutlinedIcon />}
                    disableElevation
                    variant='text'
                    color="default"
                    size='small'
                    type="submit"
                    disabled={!canDisableVisibility}
                    onClick={() => toggleDisable('caché')}
                >Cacher</Button>
                <Button
                    endIcon={<VisibilityOutlined />}
                    disableElevation
                    variant='text'
                    color="default"
                    size='small'
                    type="submit"
                    disabled={!canSetVisibility}
                    onClick={() => toggleDisable('visible')}
                >Rendre visible</Button>
            </StyledActions>
            <TableProduit setSelected={setSelectedProds} selected={selectedProds} />
            {openForm &&
                <NewProduitForm open={openForm} onClose={toggleOpenForm} />
            }
            {openUpdateForm &&
                <ProduitUpdateForm produit={selectedProds[0]} open={openUpdateForm} onClose={toggleUpdateForm} />
            }
        </StyledContainer>
    )
}
