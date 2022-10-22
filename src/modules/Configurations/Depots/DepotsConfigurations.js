import React from "react";
import styled from "@emotion/styled";
import NewDepot from "./components/NewDepot";

const StyledContainer = styled("div")(() => ({
    width: "100%",
    minHight: "calc(100% - 245px)",
    overflowX: "hidden",
    padding: "20px",
    "& > .actions": {
        marginTop: 15,
        padding: "0 10px",
        display: "flex",
        justifyContent: "flex-end",
        maxWidth: 600,
        "& > *:not(:last-child)": {
            marginRight: 15,
        },
    },
}));


export default function DepotsConfiguration() {
    return (
        <StyledContainer>
            <NewDepot />
        </StyledContainer>
    );
}