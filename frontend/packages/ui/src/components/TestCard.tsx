/** @format */

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function TestCard() {
  return (
    <div className="bg-neutral-800">
      <Card>
        <CardContent>Flot kort</CardContent>
        <CardFooter>Footer</CardFooter>
        <CardHeader>Header</CardHeader>
      </Card>
    </div>
  );
}
