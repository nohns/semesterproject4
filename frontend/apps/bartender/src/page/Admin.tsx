/** @format */

import { BeverageCard } from "@repo/ui";
import { BigScreenWrapper } from "@repo/ui";
import { Beverage } from "@repo/api";



function Admin() {

    const mock: Beverage[] = [
        {
            beverageId: "1",
            name: "Coca Cola",
            description: "A refreshing drink",
            imageSrc: "https://www.coca-cola.dk/content/dam/journey/dk/da/private/stories/history/2016/2016-06-10-coca-cola-100-ar/1915-1919-coca-cola-bottle.jpg"
        },
        {
            beverageId: "2",
            name: "Fanta",
            description: "A really refreshing drink",
            imageSrc: "https://www.coca-cola.dk/content/dam/journey/dk/da/private/stories/history/2016/2016-06-10-coca-cola-100-ar/1915-1919-coca-cola-bottle.jpg"
        },
        {
            beverageId: "3",
            name: "Sprite",
            description: "An incredibly refreshing drink",
            imageSrc: "https://www.coca-cola.dk/content/dam/journey/dk/da/private/stories/history/2016/2016-06-10-coca-cola-100-ar/1915-1919-coca-cola-bottle.jpg"
        }
    ]

    return (
        <>
            <BigScreenWrapper>
                {mock.map((beverage) => (
                    <BeverageCard key={beverage.beverageId} beverage={beverage} handleBeverageClick={() => {
                        console.log("Clicked");
                    }} />
                ))}
            </BigScreenWrapper>
        </>

    )
}

export default Admin;