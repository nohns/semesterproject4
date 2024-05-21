using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeveragePaymentApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Prices_PriceId",
                table: "Orders");

            migrationBuilder.AlterColumn<int>(
                name: "PriceId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_BeverageId",
                table: "Orders",
                column: "BeverageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Beverages_BeverageId",
                table: "Orders",
                column: "BeverageId",
                principalTable: "Beverages",
                principalColumn: "BeverageId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Prices_PriceId",
                table: "Orders",
                column: "PriceId",
                principalTable: "Prices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Beverages_BeverageId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Prices_PriceId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_BeverageId",
                table: "Orders");

            migrationBuilder.AlterColumn<int>(
                name: "PriceId",
                table: "Orders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Prices_PriceId",
                table: "Orders",
                column: "PriceId",
                principalTable: "Prices",
                principalColumn: "Id");
        }
    }
}
