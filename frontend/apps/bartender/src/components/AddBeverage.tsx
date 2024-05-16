/** @format */

//import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { usePostBeverage } from "../../../../packages/api/src/endpoints/usePostBeverage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@repo/ui";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";

export default function AddBeverage() {
  const createBeverage = usePostBeverage();

  const formSchema = z.object({
    name: z.string().min(3, {
      message: "Navnet skal være mindst 3 bogstaver langt.",
    }),
    description: z.string().min(3, {
      message: "Beskrivelsen skal være mindst 3 bogstaver lang.",
    }),
    ImageSrc: z.string().url({
      message: "Billedet skal være en URL.",
    }),
    basePrice: z.number().min(1, {
      message: "Basissprisen skal være mindst 1 kr.",
    }),

    minPrice: z.number().min(1, {
      message: "Minsprisen skal være mindst 1 kr.",
    }),
    maxPrice: z.number().min(1, {
      message: "Maksprisen skal være mindst 1 kr.",
    }),
    active: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      ImageSrc: "",
      basePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      active: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  /*  const addBeverageClick = (e: React.FormEvent<HTMLFormElement>) => {
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
  }; */

  /*  const handleInputChange =
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
    }; */

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="w-full">Tilføj nyt produkt</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilføj nyt produkt</DialogTitle>
            <DialogDescription>
              Udfyld informationerne her omkring det nye produkt
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/*Name*/}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navn</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*Description*/}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beskrivelse</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*ImageSrc*/}
              <FormField
                control={form.control}
                name="ImageSrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billede URL</FormLabel>
                    <FormControl>
                      <Input lang="dk" type="file" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*BasePrice*/}
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Basisspris</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*MinPrice*/}
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minspris</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*MaxPrice*/}
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Makspris</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*Active*/}
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aktiv</FormLabel>
                    <FormControl>
                      <Input type="checkbox" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Tilføj produktet</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/*  <Dialog.Root>
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
      </Dialog.Root> */}
    </>
  );
}
