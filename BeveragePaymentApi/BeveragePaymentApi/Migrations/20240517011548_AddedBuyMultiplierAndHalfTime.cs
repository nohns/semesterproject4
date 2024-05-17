using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeveragePaymentApi.Migrations
{
    /// <inheritdoc />
    public partial class AddedBuyMultiplierAndHalfTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "BuyMultiplier",
                table: "Beverages",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "HalfTime",
                table: "Beverages",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuyMultiplier",
                table: "Beverages");

            migrationBuilder.DropColumn(
                name: "HalfTime",
                table: "Beverages");
        }
    }
}
