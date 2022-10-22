import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import ProduitsConfigurations from '../../modules/Configurations/Produits/ProduitsConfigurations';
import VisualizeProduct from '../../modules/Configurations/Produits/components/VisualizeProduct';
import NewProduitForm from '../../modules/Configurations/Produits/components/NewProduitForm';
import ProduitUpdateForm from '../../modules/Configurations/Produits/components/UpdateForm';
import axios from 'axios';

export const CategoryContext = createContext();

const StyledContainer = styled('div')(() => ({
    width: '100%',
    "& .main": {
        marginLeft: 340,
    }
}));

export default function ProduitConfigRoutes() {
    let location = useLocation();
    const navigate = useNavigate()
    let state = location.state;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    const goBack = () => {
        navigate(-1);
    }

    useEffect(() => {
        if (categories.length === 0) {
            setLoading(true);
            axios
                .get('/api/categorie_produit')
                .then(res => {
                    const d = res.data;
                    setCategories(d);
                }).catch(err => {
                    console.log(err);
                }).finally(() => setLoading(false));
        }
    }, [categories]);

    return (
        <CategoryContext.Provider value={{ categories, loading, selectedCategory, setSelectedCategory }}>
            <StyledContainer>
                <div className="main">
                    <Routes location={state ? state.backgroundLocation : location.pathname}>
                        <Route
                            path=""
                            element={<ProduitsConfigurations />}
                        />
                    </Routes>
                    {/* Show the modal when a `backgroundLocation` is set */}
                    {state && state.backgroundLocation && (
                        <Routes>
                            <Route path=":id" element={<VisualizeProduct open={true} onClose={goBack} />} />
                            <Route path="/nouveau" element={<NewProduitForm open={true} onClose={goBack} categories={categories} />} />
                            <Route path=":id/update" element={<ProduitUpdateForm open={true} onClose={goBack} />} />
                        </Routes>
                    )}
                </div>
            </StyledContainer>
        </CategoryContext.Provider>
    )
}
