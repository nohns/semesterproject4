﻿// <auto-generated />
using BeveragePaymentApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BeveragePaymentApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240417153504_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BeveragePaymentApi.Domain.Beverage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("BaseValue")
                        .HasColumnType("int");

                    b.Property<int>("LowerBoundary")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("UpperBoundary")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Beverages");
                });
#pragma warning restore 612, 618
        }
    }
}