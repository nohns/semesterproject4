/** @format */

import React from "react";
import NewDrinkCard from "@/components/ui/NewBeverageCard";
import { BigScreenWrapper } from "@repo/ui";


function Admin() {
    return (
        <>
            <BigScreenWrapper>
                <NewDrinkCard />
            </BigScreenWrapper>
        </>

    )
}

export default Admin;