import { Button } from "../../../../packages/ui/src/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { usePostBeverage } from "../../../../packages/api/src/endpoints/usePostBeverage";

export default function AddBeverage() {
  const createBeverage = usePostBeverage();
  const [beverageName, setBeverageName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");

  const addBeverageClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!beverageName || !description || !basePrice || !maxPrice || !minPrice) {
      setError("Please fill out all fields");
      return;
    }
    createBeverage.mutate({
      beverage: {
        name: beverageName,
        description: description,
        basePrice: basePrice,
        maxPrice: maxPrice,
        minPrice: minPrice,
      },
    });
  };

  const handleInputChange =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError("");
      const value = e.target.value;
      setter(
        typeof value === "string" && value !== "" && !isNaN(Number(value))
          ? (Number(value) as unknown as T)
          : value === ""
            ? (undefined as unknown as T)
            : (value as unknown as T)
      );
    };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button className=" text-violet11 shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none not:focus:shadow-blackA4">
            Add Beverage
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-[4px] shadow-blackA4">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Add Beverage
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Add new beverage to the Foobar Menu. Click save changes when done.
            </Dialog.Description>
            <form onSubmit={addBeverageClick}>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="text-violet11 w-[90px] text-right text-[15px]"
                  htmlFor="name"
                >
                  Name:
                </label>
                <input
                  className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="name"
                  type="text"
                  value={beverageName}
                  onChange={handleInputChange(setBeverageName)}
                  required
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="text-violet11 w-[90px] text-right text-[15px]"
                  htmlFor="username"
                >
                  Description:
                </label>
                <input
                  className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="description"
                  type="text"
                  value={description}
                  onChange={handleInputChange(setDescription)}
                  required
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="text-violet11 w-[90px] text-right text-[15px]"
                  htmlFor="username"
                >
                  Base price:
                </label>
                <input
                  className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="basePrice"
                  type="number"
                  value={basePrice || ""}
                  onChange={handleInputChange(setBasePrice)}
                  required
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="text-violet11 w-[90px] text-right text-[15px]"
                  htmlFor="username"
                >
                  Maximum price:
                </label>
                <input
                  className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="maxPrice"
                  type="number"
                  value={maxPrice || ""}
                  onChange={handleInputChange(setMaxPrice)}
                  required
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="text-violet11 w-[90px] text-right text-[15px]"
                  htmlFor="username"
                >
                  Minimum price:
                </label>
                <input
                  className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="minPrice"
                  type="number"
                  value={minPrice || ""}
                  onChange={handleInputChange(setMinPrice)}
                  required
                />
              </fieldset>
              <div className="mt-[25px] flex justify-end">
                <Dialog.Close asChild>
                  <button
                    className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                    type="submit"
                  >
                    Save changes
                  </button>
                </Dialog.Close>
              </div>
            </form>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
