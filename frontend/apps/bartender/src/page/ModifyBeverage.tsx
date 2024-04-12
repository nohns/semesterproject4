/** @format */
import React from "react";

import { ProductCard, ProductProps, productsMock } from "@repo/ui";
import NewDrinkCard from "@/components/ui/NewBeverageCard";
import { useGetBeverages, useLogin } from "@repo/api";
import { Button } from "@/components/ui/button";

function ModifyBeverage() {
  const mutate = useLogin();

  const { data, error, isLoading } = useGetBeverages();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  //https://ui.shadcn.com/docs/components/form

  //mindst 8 bogstaver store tegn og tal

  const handleLogin = () => {
    mutate.mutate({ username: username, password: password });
  };

  return (
    <div>
      <h1>Bartender react app</h1>

      <Button onClick={handleLogin}>Login</Button>

      <NewDrinkCard />
      <div className="flex flex-row  ">
        {productsMock.map((product: ProductProps) => (
          <React.Fragment key={product.id}>
            <ProductCard product={product} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ModifyBeverage;
