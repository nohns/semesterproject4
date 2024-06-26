/** @format */

import { usePostBeverage } from "@repo/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { Button } from "@repo/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui";
import { Checkbox } from "@repo/ui";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export default function AddBeverage() {
  const createBeverage = usePostBeverage();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    null | "success" | "error"
  >(null); // State for submission status

  const formSchema = z
    .object({
      name: z.string().min(1, {
        message: "Navn skal udfyldes.",
      }),
      description: z.string().min(1, {
        message: "Beskrivelse skal udfyldes.",
      }),
      ImageSrc: z.instanceof(File, {
        message: "Billede skal være en fil.",
      }),
      basePrice: z.preprocess(
        (val) => Number(val),
        z.number().min(1, {
          message: "Basis pris skal være mindst 1 kr.",
        })
      ),
      minPrice: z.preprocess(
        (val) => Number(val),
        z.number().min(1, {
          message: "Minimum pris skal være mindst 1 kr.",
        })
      ),
      maxPrice: z.preprocess(
        (val) => Number(val),
        z.number().min(1, {
          message: "Maksimum pris skal være mindst 1 kr.",
        })
      ),

      buyMultiplier: z
        .preprocess((val) => Number(val), z.number())
        .refine((value) => value > 1, {
          message: "Multiplier skal være større end 1.",
        }),

      halfTime: z.preprocess(
        (val) => Number(val),
        z
          .number()
          .min(1, {
            message: "Halveringstiden skal være mindst 1",
          })
          .refine((val) => Number.isInteger(val), {
            message: "Halveringstiden skal være et heltal",
          })
      ),
      active: z.boolean().default(true),
    })
    .refine((data) => data.minPrice <= data.basePrice, {
      path: ["minPrice"],
      message: "Minimum pris kan ikke være større end basis pris.",
    })
    .refine((data) => data.maxPrice >= data.basePrice, {
      path: ["maxPrice"],
      message: "Maksimum pris kan ikke være mindre end basis pris.",
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
      buyMultiplier: 1.1,
      halfTime: 1,
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
        buyMultiplier: values.buyMultiplier,
        halfTime: values.halfTime,
        isActive: values.active,
      },
      file: values.ImageSrc,
    };

    console.log("Creating beverage:", beverageData);

    createBeverage.mutate(beverageData, {
      onSuccess: () => {
        console.log("Beverage created successfully");
        setSubmissionStatus("success");
        queryClient.invalidateQueries({ queryKey: ["beverages"] });
        setOpen(false);
      },
      onError: (error) => {
        console.error("Error creating beverage:", error);
        setSubmissionStatus("error");
      },
    });
  }

  useEffect(() => {
    if (!open) {
      setSubmissionStatus(null);
      form.reset(); // Reset form fields when modal is closed
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Tilføj nyt produkt</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tilføj nyt produkt</DialogTitle>
          <DialogDescription>
            Udfyld informationerne her omkring det nye produkt
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
              name="ImageSrc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billede</FormLabel>
                  <FormControl>
                    <Input
                      lang="da"
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
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basis pris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum pris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maksimum pris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyMultiplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Købs multiplier</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="halfTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Halveringstid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Aktiver produkt
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={createBeverage.isPending}
            >
              Tilføj produktet
            </Button>
          </form>
        </Form>
        {submissionStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-4 p-4 rounded-md text-white ${
              submissionStatus === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {submissionStatus === "success" ? (
              <div className="flex items-center gap-x-4">
                <CheckCircledIcon className="h-12 w-12" />
                Produktet er tilføjet!
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                <ExclamationTriangleIcon className="h-12 w-12" />
                Der opstod en fejl. Prøv igen.
              </div>
            )}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
