/** @format */

// import { Cross2Icon } from "@radix-ui/react-icons";
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
    ImageSrc: z.instanceof(File, {
      message: "Billedet skal være en fil.",
    }),
    basePrice: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Basissprisen skal være mindst 1 kr.",
      })
    ),
    minPrice: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Minsprisen skal være mindst 1 kr.",
      })
    ),
    maxPrice: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Maksprisen skal være mindst 1 kr.",
      })
    ),
    active: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      ImageSrc: undefined,
      basePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      active: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const beverageData = {
      beverage: {
        name: values.name,
        description: values.description,
        basePrice: values.basePrice,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        isActive: values.active,
      },
      file: values.ImageSrc,
    };

    createBeverage.mutate(beverageData, {
      onSuccess: () => {
        console.log("Beverage created successfully");
        // Handle additional logic here
      },
      onError: (error) => {
        console.error("Error creating beverage:", error);
      },
    });
  }

  return (
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
            {/* Name */}
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
            {/* Description */}
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
            {/* ImageSrc */}
            <FormField
              control={form.control}
              name="ImageSrc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billede</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* BasePrice */}
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basisspris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* MinPrice */}
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minspris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* MaxPrice */}
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Makspris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Active */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aktiv</FormLabel>
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
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
  );
}
