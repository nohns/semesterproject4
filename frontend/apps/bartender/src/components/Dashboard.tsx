/** @format */

//import Image from "next/image";
import { MoreHorizontal } from "Lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Beverage, useGetBeverages } from "@repo/api";

function Dashboard() {
  //const { data, isLoading, isError } = useGetBeverages();

  const mock = [
    {
      beverageId: "1",
      name: "Øl",
      status: "Active",
      price: 30,
      description: "A refreshing drink",
      totalSales: 30,
      imageSrc: "/images/bajselademad.jpg",
    },
    {
      beverageId: "2",
      name: "Snaps",
      status: "Inactive",
      price: 50,
      description: "A really refreshing drink",
      totalSales: 0,
      imageSrc: "/images/snaps.jpg",
    },
    {
      beverageId: "3",
      name: "Vand",
      status: "Active",
      price: 20,
      description: "An incredibly refreshing drink",
      totalSales: 50,
      imageSrc: "/images/vand.jpg",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mock.map((beverage) => (
              <TableRow>
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
                  <Badge variant="outline">{beverage.status}</Badge>
                </TableCell>
                <TableCell>{beverage.price} dkk</TableCell>
                <TableCell className="hidden md:table-cell">
                  {beverage.totalSales}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}

export default Dashboard;
