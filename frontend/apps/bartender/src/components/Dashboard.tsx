/** @format */

//import Image from "next/image";
import { useGetBeverages } from "@repo/api";
import { MoreHorizontal } from "Lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Button } from "@repo/ui";
import AddBeverage from "./AddBeverage";

function Dashboard() {
  const { data: beverages, isLoading, error } = useGetBeverages();

   if (isLoading) {
    return (
      <Card>
        <CardHeader>Loading beverages...</CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>Error fetching beverages.</CardHeader>
      </Card>
    );
  } 

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex flex-col w-full gap-y-2">
          <CardTitle className="">Produkter</CardTitle>
          <CardDescription className="">
            Administrér dine produkter og se deres salg.
          </CardDescription>
          <AddBeverage />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Billede</span>
              </TableHead>
              <TableHead>Navn</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pris</TableHead>
              <TableHead className="hidden md:table-cell">
                Solgte enheder
              </TableHead>
              <TableHead>
                <span className="sr-only">Handlinger</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beverages &&
              beverages.beverages.map((beverage) => (
                <TableRow key={beverage.beverageId}>
                  <TableCell className="hidden sm:table-cell">
                    <img
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={beverage.imageSrc}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{beverage.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {beverage.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{beverage.basePrice} dkk</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {beverage.totalSales}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Redigér</DropdownMenuItem>
                        <DropdownMenuItem>Slet</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      {/*       <CardFooter>
        <div className="text-xs text-muted-foreground">
          Viser <strong>{beverages.length}</strong> af{" "}
          <strong>{beverages.length}</strong> produkter
        </div>
      </CardFooter> */}
    </Card>
  );
}

export default Dashboard;
