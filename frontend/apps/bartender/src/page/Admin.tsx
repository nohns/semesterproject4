/** @format */

import { BeverageCard } from "@repo/ui";
import { BigScreenWrapper } from "@repo/ui";
import { Beverage } from "@repo/api";



function Admin() {

    const mock: Beverage[] = [
        {
            beverageId: "1",
            name: "Øl",
            description: "A refreshing drink",
            imageSrc: "/images/bajselademad.jpg"
        },
        {
            beverageId: "2",
            name: "Snaps",
            description: "A really refreshing drink",
            imageSrc: "/images/snaps.jpg"
        },
        {
            beverageId: "3",
            name: "Vand",
            description: "An incredibly refreshing drink",
            imageSrc: "../../public/images/vand.jpg"
        }
    ]

    return (
        <>
            <BigScreenWrapper>
                <div className="h-full flex-col items-center w-6/12 gap-6">
                    {mock.map((beverage) => (
                        <BeverageCard key={beverage.beverageId} beverage={beverage} handleBeverageClick={() => {
                            console.log("Clicked");
                        }} />
                    ))}
                </div>
            </BigScreenWrapper>
            
        </>

    )
}

export default Admin;