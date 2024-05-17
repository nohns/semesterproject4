using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeveragePaymentApi.Migrations
{
    /// <inheritdoc />
    public partial class HalfTimeFromStringToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "HalfTime",
                table: "Beverages",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "HalfTime",
                table: "Beverages",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
