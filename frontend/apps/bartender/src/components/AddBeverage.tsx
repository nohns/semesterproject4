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
    active: z.boolean().default(true),
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

    console.log("Creating beverage:", beverageData);

    createBeverage.mutate(beverageData, {
      onSuccess: () => {
        console.log("Beverage created successfully");
        // Handle additional logic here
        setSubmissionStatus("success");
        queryClient.invalidateQueries({ queryKey: ["beverages"] });
        setTimeout(() => {
          setOpen(false);
          setSubmissionStatus(null);
        }, 1500);
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
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
            {/* BasePrice */}
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
                      /* onChange={(e) => field.onChange(Number(e.target.value))} */
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
                  <FormLabel>Minimum pris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      /* onChange={(e) => field.onChange(Number(e.target.value))} */
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
                  <FormLabel>Maksimum pris</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      /* onChange={(e) => field.onChange(Number(e.target.value))} */
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

            <Button className="w-full" type="submit">
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
